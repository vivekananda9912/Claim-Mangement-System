/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseModel, ICase, CareLine, TimingType, CaseStatus } from './case.model';
import { policyService } from '../policy/policy.service';
import { claimService } from '../claim/claim.service';
import { taskService } from '../task/task.service';
import { eventService } from '../event/event.service';
import { ClaimModel } from '../claim/claim.model';
import { EvidenceModel } from '../evidence/evidence.model';
import { FraudAssessmentModel } from '../fraud/fraud.model';
import { ICaseActor } from '../event/event.model';

export class CaseService {
  /**
   * Stage 1: Initiates a new Case by strictly verifying Policy & Family Eligibility
   */
  public async initializeCase(params: {
    policyNumber: string;
    memberId: string;
    careLine: CareLine;
    timingType: TimingType;
    incidentDate: Date;
    actor: ICaseActor;
  }): Promise<{ caseRecord: ICase; eligibilityResult: any }> {
    // 1. Deterministic Stage 1 Policy Check
    const eligibility = await policyService.verifyEligibility({
      familyPolicyNumber: params.policyNumber,
      patientMemberId: params.memberId,
      careCategory: params.careLine,
      serviceDate: params.incidentDate,
    });

    if (!eligibility.isEligible) {
      throw new Error(`Stage 1 Policy Ineligible: ${eligibility.message}`);
    }

    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase = new CaseModel({
      caseId,
      currentStage: 1, // Stage 1 Policy & Family Eligibility
      policyNumber: params.policyNumber,
      memberId: params.memberId,
      careLine: params.careLine,
      timingType: params.timingType,
      status: 'ACTIVE',
      financialSummary: {
        totalBilled: 0,
        totalApproved: 0,
        preliminaryReserve: 0,
        deductibleApplied: eligibility.deductibleRemaining,
        copayApplied: eligibility.categoryBenefit?.copay || 0,
        settlementAmount: 0,
      },
      isDuplicate: false,
      isDeficient: false,
      isFraudFlagged: false,
    });

    const saved = await newCase.save();

    // Append Case Created event
    await eventService.appendEvent(
      caseId,
      'CASE_CREATED',
      1,
      params.actor,
      {
        policyNumber: params.policyNumber,
        memberId: params.memberId,
        patientName: eligibility.patient?.fullName,
        careLine: params.careLine,
        planName: eligibility.policy?.planName,
      }
    );

    // Append Policy Verified event
    await eventService.appendEvent(
      caseId,
      'POLICY_VERIFIED',
      1,
      params.actor,
      {
        planCode: eligibility.policy?.planCode,
        remainingDeductible: eligibility.deductibleRemaining,
        copay: eligibility.categoryBenefit?.copay,
      }
    );

    // Spawn intake task in workbasket
    await taskService.createTask({
      caseId,
      stageNumber: 1,
      title: `Intake Claim Data for Case ${caseId}`,
      description: `Verified ${eligibility.policy?.planName} coverage for member ${eligibility.patient?.fullName} (${params.memberId}). Awaiting claim billing lines.`,
      workbasket: 'INTAKE',
      assignedRole: 'BUSINESS_REQUESTER',
      priority: 'MEDIUM',
      slaHours: 24,
      actor: params.actor,
    });

    return { caseRecord: saved, eligibilityResult: eligibility };
  }

  /**
   * Stage 2: Intakes Claim Lines with Duplicate Check Execution
   */
  public async intakeClaim(
    caseId: string,
    claimData: {
      claimId: string;
      providerNpi: string;
      providerName: string;
      dateOfServiceStart: Date;
      dateOfServiceEnd?: Date;
      diagnosisCodes: string[];
      totalBilledAmount: number;
      priorAuthNumber?: string;
      items: Array<{
        itemId: string;
        procedureCode: string;
        description: string;
        serviceDate: Date;
        billedAmount: number;
      }>;
    },
    actor: ICaseActor
  ) {
    const caseRecord = await CaseModel.findOne({ caseId }).exec();
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    // Run duplicate check first
    const dupCheck = await claimService.checkDuplicate({
      claimId: claimData.claimId,
      npi: claimData.providerNpi,
      memberId: caseRecord.memberId,
      serviceStartDate: claimData.dateOfServiceStart,
      totalBilledAmount: claimData.totalBilledAmount,
    });

    // Create claim record in database
    const claim = await claimService.createClaim({
      claimId: claimData.claimId,
      caseId: caseRecord.caseId as any,
      claimType: caseRecord.timingType,
      careCategory: caseRecord.careLine,
      provider: {
        npi: claimData.providerNpi,
        name: claimData.providerName,
        facilityType: 'INSTITUTIONAL',
      },
      patient: {
        memberId: caseRecord.memberId,
        name: caseRecord.memberId,
        familyPolicyNumber: caseRecord.policyNumber,
      },
      serviceStartDate: claimData.dateOfServiceStart,
      serviceEndDate: claimData.dateOfServiceEnd || claimData.dateOfServiceStart,
      diagnoses: claimData.diagnosisCodes.map((code, idx) => ({
        code,
        description: `Diagnosis ${code}`,
        isPrimary: idx === 0,
      })),
      totalBilledAmount: claimData.totalBilledAmount,
      submissionChannel: 'WEB_PROVIDER_PORTAL',
      items: claimData.items.map((i) => ({
        itemId: i.itemId,
        procedureCode: i.procedureCode,
        description: i.description,
        category: caseRecord.careLine,
        serviceDate: i.serviceDate,
        billedAmount: i.billedAmount,
        feeScheduleAllowable: i.billedAmount * 0.85,
        copay: caseRecord.financialSummary.copayApplied,
        coinsurance: 0,
        eligiblePayout: i.billedAmount * 0.85,
        clinicalReviewStatus: 'PENDING_DOCTOR_REVIEW',
        adjudicatedAmount: 0,
      })),
    } as any);

    caseRecord.claimId = claim.claimId;
    caseRecord.financialSummary.totalBilled = claim.totalBilledAmount;
    caseRecord.financialSummary.preliminaryReserve = Math.round(claim.totalBilledAmount * 0.85);

    // Evaluate duplicate detection outcome
    if (dupCheck.isDuplicate) {
      caseRecord.isDuplicate = true;
      caseRecord.status = 'SUSPENDED_FRAUD';

      await eventService.appendEvent(
        caseId,
        'DUPLICATE_CHECK_FLAGGED',
        2,
        actor,
        {
          claimId: claim.claimId,
          exactClaimIdMatch: dupCheck.exactClaimIdMatch,
          compositeMatch: dupCheck.compositeMatch,
          matchedClaimId: dupCheck.matchedClaimId,
          matchedCaseId: dupCheck.matchedCaseId,
        }
      );

      // Create SIU task
      await taskService.createTask({
        caseId,
        stageNumber: 2,
        title: `Duplicate Claim Investigation: ${claim.claimId}`,
        description: dupCheck.message,
        workbasket: 'FRAUD_SIU',
        assignedRole: 'OPERATIONS_ANALYST',
        priority: 'URGENT',
        slaHours: 8,
        actor,
      });
    } else {
      caseRecord.currentStage = 2; // Advance to Stage 2
      caseRecord.isDuplicate = false;

      await eventService.appendEvent(
        caseId,
        'DUPLICATE_CHECK_PASSED',
        2,
        actor,
        { claimId: claim.claimId, totalBilled: claim.totalBilledAmount }
      );

      // Automatically require Stage 3 evidence documents
      caseRecord.isDeficient = true;
      caseRecord.status = 'PENDING_INFO';

      await eventService.appendEvent(
        caseId,
        'DEFICIENCY_RAISED',
        3,
        actor,
        { requiredDocuments: ['ITEMIZED_BILL', 'HCFA1500_OR_UB04'] }
      );

      await taskService.createTask({
        caseId,
        stageNumber: 3,
        title: `Submit Supporting Evidence & Itemized Bills for ${claim.claimId}`,
        description: `Member ${caseRecord.memberId} billed $${claim.totalBilledAmount}. Official DCN itemized billing and medical scripts required.`,
        workbasket: 'EVIDENCE_DEFICIENCY',
        assignedRole: 'BUSINESS_REQUESTER',
        priority: 'MEDIUM',
        slaHours: 48,
        actor,
      });
    }

    const saved = await caseRecord.save();
    return { caseRecord: saved, claim };
  }

  /**
   * Stage Progression Coordinator: Enforces strict stage gating
   */
  public async advanceStage(
    caseId: string,
    targetStage: number,
    actor: ICaseActor
  ): Promise<ICase> {
    const caseRecord = await CaseModel.findOne({ caseId }).exec();
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    if (targetStage < 1 || targetStage > 6) {
      throw new Error(`Invalid stage number ${targetStage}. Must be between 1 and 6.`);
    }

    // Gating checks
    if (targetStage >= 3 && caseRecord.isDuplicate) {
      throw new Error('Gating Violation: Cannot advance past Stage 2 while duplicate flag is unresolved.');
    }

    if (targetStage >= 4) {
      const evidences = await EvidenceModel.find({ caseId }).exec();
      const hasVerified = evidences.some((e) => e.verificationStatus === 'VERIFIED');
      if (!hasVerified) {
        throw new Error('Gating Violation: Cannot enter Stage 4 without at least one verified DCN evidence record.');
      }
      caseRecord.isDeficient = false;
      if (caseRecord.status === 'PENDING_INFO') caseRecord.status = 'ACTIVE';
    }

    if (targetStage >= 5) {
      const claim = await ClaimModel.findOne({ claimId: caseRecord.claimId }).exec();
      const isAdjudicated = claim && claim.items.every((i: any) => i.clinicalReviewStatus !== 'PENDING_DOCTOR_REVIEW');
      if (!isAdjudicated) {
        throw new Error('Gating Violation: Cannot enter Stage 5 before clinical adjudication is completed.');
      }
      const fraud = await FraudAssessmentModel.findOne({ caseId }).exec();
      if (fraud && fraud.isUnderInvestigation) {
        throw new Error('Gating Violation: Active SIU fraud investigation is blocking settlement.');
      }
    }

    const fromStage = caseRecord.currentStage;
    caseRecord.currentStage = targetStage;
    const saved = await caseRecord.save();

    await eventService.appendEvent(
      caseId,
      'STAGE_TRANSITIONED',
      targetStage,
      actor,
      { fromStage, toStage: targetStage }
    );

    return saved;
  }

  /**
   * Stage 5: Settlement & Disbursement
   */
  public async disburseSettlement(
    caseId: string,
    paymentMethod: 'EFT_DIRECT_DEPOSIT' | 'CHECK_DISBURSEMENT' | 'VIRTUAL_CARD',
    checkNumberOrEft: string,
    actor: ICaseActor
  ): Promise<ICase> {
    const caseRecord = await CaseModel.findOne({ caseId }).exec();
    if (!caseRecord) throw new Error(`Case not found: ${caseId}`);

    const claim = await ClaimModel.findOne({ claimId: caseRecord.claimId }).exec();
    if (!claim) throw new Error(`Claim not found for case: ${caseId}`);

    const totalApproved = claim.items.reduce((sum: number, item: any) => sum + (item.adjudicatedAmount || 0), 0);

    // Calculate final settlement net payout = totalApproved - deductible - copay
    const netSettlement = Math.max(
      0,
      totalApproved - caseRecord.financialSummary.deductibleApplied - caseRecord.financialSummary.copayApplied
    );

    caseRecord.financialSummary.totalApproved = totalApproved;
    caseRecord.financialSummary.settlementAmount = netSettlement;

    const voucherId = `VCHR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    caseRecord.settlementVoucher = {
      voucherId,
      paymentMethod,
      checkNumberOrEft,
      issuedAt: new Date(),
      disbursedBy: actor.fullName,
    };

    caseRecord.status = 'APPROVED';
    caseRecord.currentStage = 6; // Move to Stage 6 Closed & Archived
    const saved = await caseRecord.save();

    await eventService.appendEvent(
      caseId,
      'SETTLEMENT_DISBURSED',
      5,
      actor,
      {
        voucherId,
        paymentMethod,
        checkNumberOrEft,
        settlementAmount: netSettlement,
      }
    );

    await eventService.appendEvent(
      caseId,
      'CASE_CLOSED',
      6,
      actor,
      { finalStatus: 'APPROVED', voucherId }
    );

    return saved;
  }

  public async getCaseById(caseId: string): Promise<ICase | null> {
    return await CaseModel.findOne({ caseId }).exec();
  }

  public async listCases(filter: { stage?: number; status?: CaseStatus; careLine?: CareLine } = {}): Promise<ICase[]> {
    const query: any = {};
    if (filter.stage) query.currentStage = filter.stage;
    if (filter.status) query.status = filter.status;
    if (filter.careLine) query.careLine = filter.careLine;
    return await CaseModel.find(query).sort({ updatedAt: -1 }).exec();
  }
}

export const caseService = new CaseService();
