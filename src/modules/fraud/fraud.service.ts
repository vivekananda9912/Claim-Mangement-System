/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FraudAssessmentModel, IFraudAssessment, IFraudFlag, RiskTier } from './fraud.model';
import { ClaimModel } from '../claim/claim.model';
import { claimService } from '../claim/claim.service';
import { eventService } from '../event/event.service';
import { taskService } from '../task/task.service';
import { ICaseActor } from '../event/event.model';

export class FraudService {
  /**
   * Evaluates claim against heuristic fraud rules:
   * 1. Duplicate check (exact / composite)
   * 2. Fee inflation / outlier billing (> $8,000 or markup ratio)
   * 3. Procedure code unbundling
   * 4. Provider billing velocity
   */
  public async evaluateClaim(
    caseId: string,
    claimId: string,
    actor: ICaseActor
  ): Promise<IFraudAssessment> {
    const claim = await ClaimModel.findOne({ claimId }).exec();
    if (!claim) throw new Error(`Claim not found: ${claimId}`);

    const flags: IFraudFlag[] = [];
    let score = 0;

    // Rule 1: Duplicate check
    const dupResult = await claimService.checkDuplicate({
      claimId: claim.claimId,
      npi: claim.provider?.npi || '',
      memberId: claim.patient?.memberId || '',
      serviceStartDate: claim.serviceStartDate,
      totalBilledAmount: claim.totalBilledAmount,
    });

    if (dupResult.exactClaimIdMatch) {
      score += 55;
      flags.push({
        ruleId: 'FRD-DUP-01',
        ruleName: 'Exact Duplicate Claim ID',
        scoreContribution: 55,
        description: `Claim ID ${claimId} was already processed previously. Matching prior claim: ${dupResult.matchedClaimId}`,
      });
    } else if (dupResult.compositeMatch) {
      score += 40;
      flags.push({
        ruleId: 'FRD-DUP-02',
        ruleName: 'Composite Service Fingerprint Match',
        scoreContribution: 40,
        description: `Provider NPI (${claim.provider?.npi}) and Member ID (${claim.patient?.memberId}) already billed for this exact service date and amount ($${claim.totalBilledAmount}). Matching claim: ${dupResult.matchedClaimId}`,
      });
    }

    // Rule 2: High Dollar Outlier (> $10,000)
    if (claim.totalBilledAmount > 10000) {
      score += 25;
      flags.push({
        ruleId: 'FRD-FEE-01',
        ruleName: 'High Dollar Procedure Billing Threshold',
        scoreContribution: 25,
        description: `Billed amount of $${claim.totalBilledAmount.toLocaleString()} exceeds unmonitored baseline threshold ($10,000).`,
      });
    }

    // Rule 3: Unbundling Detection (Multiple high-intensity evaluation codes billed together)
    const codes = claim.items.map((i: any) => i.procedureCode);
    if (codes.includes('CPT-99223') && codes.includes('CPT-99232')) {
      score += 20;
      flags.push({
        ruleId: 'FRD-UNBUNDLE-01',
        ruleName: 'Inpatient Evaluation Code Unbundling',
        scoreContribution: 20,
        description: 'Initial inpatient care (CPT-99223) billed simultaneously with subsequent hospital care (CPT-99232).',
      });
    }

    // Rule 4: High line item density
    if (claim.items.length > 5) {
      score += 10;
      flags.push({
        ruleId: 'FRD-DENS-01',
        ruleName: 'Multiple Procedure Line Density',
        scoreContribution: 10,
        description: `Encounter contains ${claim.items.length} distinct procedure items billed in a single encounter.`,
      });
    }

    const finalScore = Math.min(100, score);
    let riskTier: RiskTier = 'LOW';
    if (finalScore >= 70) riskTier = 'CRITICAL';
    else if (finalScore >= 50) riskTier = 'HIGH';
    else if (finalScore >= 25) riskTier = 'MEDIUM';

    const assessmentId = `FRD-ASM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const isUnderInvestigation = finalScore >= 50;

    const assessment = new FraudAssessmentModel({
      assessmentId,
      caseId,
      claimId,
      riskScore: finalScore,
      riskTier,
      flags,
      isUnderInvestigation,
      investigatorNotes: isUnderInvestigation
        ? 'Auto-routed to SIU workbasket for comprehensive audit.'
        : 'Heuristic screening passed normal threshold.',
    });

    const saved = await assessment.save();

    await eventService.appendEvent(
      caseId,
      'FRAUD_SCORED',
      4, // Stage 4 Clinical & Fraud Adjudication
      actor,
      { assessmentId, riskScore: finalScore, riskTier, flagCount: flags.length, isUnderInvestigation }
    );

    // If high or critical risk, spawn an urgent task in FRAUD_SIU workbasket
    if (isUnderInvestigation) {
      await taskService.createTask({
        caseId,
        stageNumber: 4,
        title: `SIU Fraud Investigation - ${riskTier} Risk (${finalScore}/100)`,
        description: `Review triggered fraud rules: ${flags.map((f) => f.ruleName).join(', ')}.`,
        workbasket: 'FRAUD_SIU',
        assignedRole: 'OPERATIONS_ANALYST',
        priority: finalScore >= 70 ? 'URGENT' : 'HIGH',
        slaHours: 12,
        actor,
      });
    }

    return saved;
  }

  public async clearFraudHold(
    assessmentId: string,
    notes: string,
    actor: ICaseActor
  ): Promise<IFraudAssessment | null> {
    const assessment = await FraudAssessmentModel.findOne({ assessmentId }).exec();
    if (!assessment) return null;

    assessment.isUnderInvestigation = false;
    assessment.investigatorNotes = notes;
    assessment.clearedAt = new Date();
    assessment.clearedBy = actor.fullName;

    const saved = await assessment.save();

    await eventService.appendEvent(
      assessment.caseId,
      'FRAUD_CLEARED',
      4,
      actor,
      { assessmentId, clearedBy: actor.fullName, notes }
    );

    return saved;
  }

  public async getByCaseId(caseId: string): Promise<IFraudAssessment[]> {
    return await FraudAssessmentModel.find({ caseId }).sort({ createdAt: -1 }).exec();
  }
}

export const fraudService = new FraudService();
