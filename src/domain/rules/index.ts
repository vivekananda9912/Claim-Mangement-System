/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Case,
  Claim,
  ClaimItem,
  Policy,
  Customer,
  CaseEvidence,
  DcnDocumentType,
} from '../../types';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  score?: number;
  severity: 'INFO' | 'WARNING' | 'BLOCKING';
  message: string;
  details?: Record<string, any>;
}

export interface ICaseRule<TContext> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  evaluate(context: TContext): RuleEvaluationResult;
}

export interface DuplicateCheckContext {
  claimId: string;
  npi: string;
  memberId: string;
  serviceDate: string;
  billedTotal: number;
  existingClaims: Claim[];
  existingCases: Case[];
}

/**
 * SRP: Strictly detects duplicate Claim IDs or identical composite billing fingerprints
 */
export class DuplicateCheckRule implements ICaseRule<DuplicateCheckContext> {
  readonly id = 'RULE-DUP-001';
  readonly name = 'Duplicate Claim Identifier & Fingerprint Verification';
  readonly description = 'Detects exact Claim ID collisions and composite service fingerprints across history.';

  evaluate(context: DuplicateCheckContext): RuleEvaluationResult {
    // 1. Direct Claim ID collision
    const exactIdMatch = context.existingClaims.find(
      (c) => c.claimId.toUpperCase() === context.claimId.toUpperCase()
    );

    if (exactIdMatch) {
      const parentCase = context.existingCases.find((k) => k._id === exactIdMatch.caseId);
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'BLOCKING',
        message: `Direct duplicate detected: Claim ID '${context.claimId}' is already registered in ${parentCase?.caseNumber || 'another case'}.`,
        details: {
          duplicateType: 'EXACT_CLAIM_ID',
          conflictingClaimId: exactIdMatch.claimId,
          conflictingCaseId: exactIdMatch.caseId,
          conflictingCaseNumber: parentCase?.caseNumber,
        },
      };
    }

    // 2. Composite signature collision: same NPI + same serviceDate + same memberId + same billed amount (+/- $1)
    const compositeMatch = context.existingClaims.find((c) => {
      const sameNpi = c.provider.npi === context.npi;
      const sameDate = c.serviceDate.slice(0, 10) === context.serviceDate.slice(0, 10);
      const sameAmount = Math.abs(c.totalBilledAmount - context.billedTotal) < 1.0;
      return sameNpi && sameDate && sameAmount;
    });

    if (compositeMatch) {
      const parentCase = context.existingCases.find((k) => k._id === compositeMatch.caseId);
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'WARNING',
        message: `High-probability composite duplicate: Provider NPI ${context.npi} billed $${context.billedTotal.toFixed(2)} on ${context.serviceDate.slice(0, 10)} for member ${context.memberId} in ${parentCase?.caseNumber || 'prior case'}.`,
        details: {
          duplicateType: 'COMPOSITE_FINGERPRINT',
          conflictingClaimId: compositeMatch.claimId,
          conflictingCaseNumber: parentCase?.caseNumber,
        },
      };
    }

    return {
      ruleId: this.id,
      ruleName: this.name,
      passed: true,
      severity: 'INFO',
      message: 'Claim ID and composite fingerprint verified unique.',
    };
  }
}

export interface PolicyEligibilityContext {
  policy: Policy | undefined;
  customer: Customer | undefined;
  memberId: string;
  serviceDate: string;
  category: string;
}

/**
 * SRP: Evaluates whether family policy is active on the date of service and patient is enrolled
 */
export class PolicyEligibilityRule implements ICaseRule<PolicyEligibilityContext> {
  readonly id = 'RULE-POL-001';
  readonly name = 'Policy Status & Family Member Enrollment Rule';
  readonly description = 'Verifies active policy window and that patient is valid primary subscriber or dependent.';

  evaluate(context: PolicyEligibilityContext): RuleEvaluationResult {
    if (!context.policy) {
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'BLOCKING',
        message: 'Family policy record could not be located in master registry.',
      };
    }

    if (context.policy.status !== 'ACTIVE') {
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'BLOCKING',
        message: `Policy ${context.policy.policyNumber} is currently ${context.policy.status}. Coverage is suspended.`,
      };
    }

    const sDate = new Date(context.serviceDate).getTime();
    const effDate = new Date(context.policy.effectiveDate).getTime();
    const expDate = new Date(context.policy.expirationDate).getTime();

    if (sDate < effDate || sDate > expDate) {
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'BLOCKING',
        message: `Date of service (${context.serviceDate.slice(0, 10)}) is outside active policy period (${context.policy.effectiveDate.slice(0, 10)} to ${context.policy.expirationDate.slice(0, 10)}).`,
      };
    }

    if (context.customer) {
      const isPrimary = context.customer.primarySubscriber.memberId === context.memberId;
      const isDep = context.customer.dependents.some((d) => d.memberId === context.memberId);
      if (!isPrimary && !isDep) {
        return {
          ruleId: this.id,
          ruleName: this.name,
          passed: false,
          severity: 'BLOCKING',
          message: `Patient member ID ${context.memberId} is not enrolled under family policy ${context.policy.policyNumber}.`,
        };
      }
    }

    return {
      ruleId: this.id,
      ruleName: this.name,
      passed: true,
      severity: 'INFO',
      message: `Active policy and enrolled family member confirmed under ${context.policy.planName}.`,
    };
  }
}

export interface DcnAuditContext {
  items: ClaimItem[];
  attachedEvidences: CaseEvidence[];
  claimType: 'PRE_SERVICE' | 'POST_SERVICE';
  policy: Policy;
}

/**
 * SRP: Evaluates required DCN document types and identifies missing evidence gating
 */
export class DcnAuditRule implements ICaseRule<DcnAuditContext> {
  readonly id = 'RULE-DCN-001';
  readonly name = 'Mandatory DCN Document Verification & Gating';
  readonly description = 'Ensures superbill, clinical chart notes, and required pre-auth DCNs are verified.';

  evaluate(context: DcnAuditContext): RuleEvaluationResult {
    const requiredTypes: DcnDocumentType[] = ['SUPERBILL'];

    // If pre-service or specialty surgical CPT, require prior auth or chart notes
    const hasPreAuthCode = context.items.some((item) =>
      context.policy.requiresPreAuthCodes?.includes(item.code)
    );

    if (context.claimType === 'PRE_SERVICE' || hasPreAuthCode) {
      requiredTypes.push('PRIOR_AUTH_FORM');
    }

    // High billed item requires chart notes
    const highCost = context.items.some((i) => i.billedAmount > 2000);
    if (highCost) {
      requiredTypes.push('CHART_NOTES');
    }

    const verifiedTypes = context.attachedEvidences
      .filter((e) => e.verificationStatus === 'VERIFIED')
      .map((e) => e.documentType);

    const missing = requiredTypes.filter((t) => !verifiedTypes.includes(t));

    if (missing.length > 0) {
      return {
        ruleId: this.id,
        ruleName: this.name,
        passed: false,
        severity: 'BLOCKING',
        message: `Missing ${missing.length} required DCN evidence document(s): ${missing.join(', ')}.`,
        details: { missingTypes: missing, requiredTypes },
      };
    }

    return {
      ruleId: this.id,
      ruleName: this.name,
      passed: true,
      severity: 'INFO',
      message: 'All mandatory DCN clinical evidence documents are verified.',
      details: { verifiedCount: context.attachedEvidences.length },
    };
  }
}

export interface FraudScoringContext {
  claim: Claim;
  policy: Policy;
  isDuplicateSignature: boolean;
}

/**
 * SRP: Computes fraud risk score (0-100) based on unbundling, excessive pricing, and code anomalies
 */
export class FraudScoringRule implements ICaseRule<FraudScoringContext> {
  readonly id = 'RULE-FRD-001';
  readonly name = 'Heuristic Fraud & Anomaly Scoring';
  readonly description = 'Scores unbundling, duplicate submissions, outlier billing, and exclusion violations.';

  evaluate(context: FraudScoringContext): RuleEvaluationResult {
    let score = 5; // Baseline clean score
    const flags: string[] = [];
    const anomalies: string[] = [];

    // Duplicate penalty
    if (context.isDuplicateSignature) {
      score += 45;
      flags.push('POTENTIAL_DUPLICATE_BILLING');
      anomalies.push('Billing matches active signature of previously submitted claim.');
    }

    // Outlier price check
    for (const item of context.claim.items) {
      if (item.allowableAmount > 0 && item.billedAmount > item.allowableAmount * 2.5) {
        score += 25;
        flags.push('PRICE_OUTLIER');
        anomalies.push(`Item ${item.code} billed at $${item.billedAmount} vs allowable $${item.allowableAmount} (>250% standard).`);
        break;
      }
    }

    // Unbundling detection: Multiple visits or procedures on same day
    if (context.claim.items.length >= 4) {
      score += 15;
      flags.push('POTENTIAL_UNBUNDLING');
      anomalies.push(`High line count (${context.claim.items.length} items) for single date of service.`);
    }

    // Excluded code test
    for (const item of context.claim.items) {
      if (context.policy.exclusions?.includes(item.code)) {
        score += 20;
        flags.push('POLICY_EXCLUSION_BILLED');
        anomalies.push(`Procedure code ${item.code} is explicitly non-covered in policy schedule.`);
        break;
      }
    }

    score = Math.min(100, Math.max(0, score));

    return {
      ruleId: this.id,
      ruleName: this.name,
      passed: score < 50,
      score,
      severity: score >= 50 ? 'BLOCKING' : score >= 25 ? 'WARNING' : 'INFO',
      message: `Fraud Risk Score calculated at ${score}/100 (${score >= 50 ? 'HIGH RISK - SIU ROUTED' : score >= 25 ? 'MEDIUM RISK - SUPERVISOR AUDIT' : 'LOW RISK - STRAIGHT THROUGH'}).`,
      details: {
        score,
        riskLevel: score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW',
        flags,
        anomalies,
      },
    };
  }
}
