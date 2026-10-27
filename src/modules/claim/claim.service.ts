/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClaimModel, IClaim } from './claim.model';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  exactClaimIdMatch: boolean;
  compositeMatch: boolean;
  matchedClaimId?: string;
  matchedCaseId?: string;
  message: string;
}

export class ClaimService {
  async createClaim(data: Partial<IClaim>): Promise<IClaim> {
    const claim = new ClaimModel(data);
    return await claim.save();
  }

  async getByClaimId(claimId: string): Promise<IClaim | null> {
    return await ClaimModel.findOne({ claimId }).exec();
  }

  async getByCaseId(caseId: string): Promise<IClaim | null> {
    return await ClaimModel.findOne({ caseId }).exec();
  }

  /**
   * Evaluates exact and composite duplicate claim heuristics
   */
  async checkDuplicate(params: {
    claimId: string;
    npi: string;
    memberId: string;
    serviceStartDate: Date;
    totalBilledAmount: number;
  }): Promise<DuplicateCheckResult> {
    // 1. Exact Claim ID collision
    const exactMatch = await ClaimModel.findOne({ claimId: params.claimId.toUpperCase().trim() }).exec();
    if (exactMatch) {
      return {
        isDuplicate: true,
        exactClaimIdMatch: true,
        compositeMatch: false,
        matchedClaimId: exactMatch.claimId,
        matchedCaseId: exactMatch.caseId ? exactMatch.caseId.toString() : undefined,
        message: `Exact duplicate detected: Claim ID '${params.claimId}' has already been processed in Case ${exactMatch.caseId || 'Prior'}.`,
      };
    }

    // 2. Composite match: Same Provider NPI + Patient Member ID + Service Date (+/- 1 day) + Same Billed Amount
    const sDate = new Date(params.serviceStartDate);
    const startWindow = new Date(sDate.getTime() - 24 * 60 * 60 * 1000);
    const endWindow = new Date(sDate.getTime() + 24 * 60 * 60 * 1000);

    const compositeMatch = await ClaimModel.findOne({
      'provider.npi': params.npi,
      'patient.memberId': params.memberId,
      serviceStartDate: { $gte: startWindow, $lte: endWindow },
      totalBilledAmount: { $gte: params.totalBilledAmount - 1.0, $lte: params.totalBilledAmount + 1.0 },
    }).exec();

    if (compositeMatch) {
      return {
        isDuplicate: true,
        exactClaimIdMatch: false,
        compositeMatch: true,
        matchedClaimId: compositeMatch.claimId,
        matchedCaseId: compositeMatch.caseId ? compositeMatch.caseId.toString() : undefined,
        message: `Composite duplicate signature match: Provider NPI ${params.npi} billed $${params.totalBilledAmount.toFixed(2)} for member ${params.memberId} within 24 hours of existing claim ${compositeMatch.claimId}.`,
      };
    }

    return {
      isDuplicate: false,
      exactClaimIdMatch: false,
      compositeMatch: false,
      message: 'Claim ID and composite billing signature are verified unique.',
    };
  }

  /**
   * Updates clinical adjudication decisions on individual claim lines
   */
  async updateLineDecisions(
    claimId: string,
    adjustments: Array<{
      itemId: string;
      clinicalReviewStatus: 'APPROVED' | 'MODIFIED_CODE' | 'DENIED';
      appliedCodeModifier?: string;
      clinicalRationale?: string;
      adjudicatedAmount?: number;
    }>
  ): Promise<IClaim | null> {
    const claim = await ClaimModel.findOne({ claimId }).exec();
    if (!claim) return null;

    for (const adj of adjustments) {
      const item = claim.items.find((i: any) => i.itemId === adj.itemId);
      if (item) {
        item.clinicalReviewStatus = adj.clinicalReviewStatus;
        if (adj.appliedCodeModifier) item.appliedCodeModifier = adj.appliedCodeModifier;
        if (adj.clinicalRationale) item.clinicalRationale = adj.clinicalRationale;
        if (adj.adjudicatedAmount !== undefined) {
          item.adjudicatedAmount = adj.adjudicatedAmount;
        } else if (adj.clinicalReviewStatus === 'DENIED') {
          item.adjudicatedAmount = 0;
        } else {
          item.adjudicatedAmount = item.feeScheduleAllowable;
        }
      }
    }

    return await claim.save();
  }
}

export const claimService = new ClaimService();
