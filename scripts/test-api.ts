/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { seedDatabase } from '../src/db/seed';
import { userService } from '../src/modules/user/user.service';
import { customerService } from '../src/modules/customer/customer.service';
import { policyService } from '../src/modules/policy/policy.service';
import { claimService } from '../src/modules/claim/claim.service';
import { caseService } from '../src/modules/case/case.service';
import { evidenceService } from '../src/modules/evidence/evidence.service';
import { doctorService } from '../src/modules/doctor/doctor.service';
import { fraudService } from '../src/modules/fraud/fraud.service';
import { taskService } from '../src/modules/task/task.service';
import { eventService } from '../src/modules/event/event.service';
import { eligibilityService } from '../src/modules/eligibility/eligibility.service';

async function runTestSuite() {
  console.log('================================================================');
  console.log('   OMNICLAIM HEALTH ENTERPRISE PLATFORM - UNIT & INTEGRATION TEST');
  console.log('================================================================\n');

  // 1. Initialize Seed Data
  await seedDatabase();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  console.log('\n--- TEST BLOCK 1: Master Customer & Policy Lookup ---');
  const customer = await customerService.getByFamilyPolicyNumber('POL-HEALTH-2026-9812');
  assert(!!customer, 'Customer family policy retrieved');
  assert(
    customer?.primarySubscriber.firstName === 'Eleanor' && customer?.primarySubscriber.lastName === 'Vance',
    'Primary subscriber matches Eleanor Vance'
  );
  assert(!!customer?.dependents && customer.dependents.length >= 2, 'Customer has covered dependents (Spouse, Children, Parent)');

  const memberLookup = await customerService.getByMemberId('MEM-9812-03');
  assert(
    memberLookup?.member.firstName === 'Chloe' && memberLookup?.member.lastName === 'Vance',
    'Found dependent child Chloe Vance by Member ID'
  );

  const policy = await policyService.getByPolicyNumber('POL-HEALTH-2026-9812');
  assert(!!policy, 'Policy master record retrieved');
  assert(policy?.familyFinancials.annualDeductible === 3000, 'Family annual deductible is $3,000');
  const medCov = policy?.categoryCoverages.find((c) => c.category === 'MEDICAL');
  assert(medCov?.copay === 40, 'Medical copay schedule is $40');

  console.log('\n--- TEST BLOCK 1B: National Healthcare ID (HCID) Eligibility Service Lookup (GET /v2/eligibility/subscribers) ---');
  // 1B.1 Direct HCID lookup
  const hcidLookup = await eligibilityService.getSubscriberByHcid('HCID-8492-1001-A');
  assert(!!hcidLookup, 'Eligibility service resolved Eleanor Vance by HCID-8492-1001-A');
  assert(hcidLookup?.household.familyHcid === 'HCID-8492-HOUSEHOLD', 'Resolved master household HCID-8492-HOUSEHOLD');
  assert(hcidLookup?.status === 'ELIGIBLE', 'Eligibility status is ELIGIBLE');
  assert(hcidLookup?.policy?.planCode === 'PPO-PLATINUM-SHIELD', 'Policy plan code is PPO-PLATINUM-SHIELD');

  // 1B.2 Query lookup with dependents (Spouse, Child, Parent)
  const householdSearch = await eligibilityService.searchSubscribers({ query: 'Thorne' });
  assert(householdSearch.data.length > 0, 'Found subscribers for Thorne household in database');
  const parentMember = householdSearch.data.find((m) => m.relationship === 'PARENT');
  assert(!!parentMember && parentMember.firstName === 'George', 'Found dependent parent George Thorne in household');

  // 1B.3 Relationship filter
  const childSearch = await eligibilityService.searchSubscribers({ relationship: 'CHILD' });
  assert(childSearch.data.length >= 4, `Found ${childSearch.data.length} child subscribers across database records`);

  console.log('\n--- TEST BLOCK 2: Authentication & Role-Based Credentials ---');
  // 2.1 Requester login
  const requesterLogin = await userService.authenticate('requester@omniclaim.internal', 'RequesterPass2026!');
  assert(!!requesterLogin, 'Business Requester login successful with bcrypt comparison');
  assert(requesterLogin?.user.role === 'BUSINESS_REQUESTER', 'User role is BUSINESS_REQUESTER');
  assert(!!requesterLogin?.token, 'JWT bearer token generated');

  // 2.2 Doctor login
  const doctorLogin = await userService.authenticate('doctor.chen@omniclaim.internal', 'DoctorChen2026!');
  assert(!!doctorLogin, 'Doctor Approver login successful');
  assert(doctorLogin?.user.role === 'DOCTOR_APPROVER', 'User role is DOCTOR_APPROVER');
  assert(doctorLogin?.user.doctorProfileId === 'DOC-PROF-9921', 'Doctor profile DOC-PROF-9921 bound to session');

  // 2.3 Bad password rejection
  const badLogin = await userService.authenticate('requester@omniclaim.internal', 'WrongPassword123');
  assert(badLogin === null, 'Bad password rejected with null return');

  console.log('\n--- TEST BLOCK 3: Stage 1 Policy & Family Eligibility ---');
  const requesterActor = {
    userId: requesterLogin!.user.userId,
    fullName: requesterLogin!.user.fullName,
    role: requesterLogin!.user.role,
  };

  const eligibleResult = await policyService.verifyEligibility({
    familyPolicyNumber: 'POL-HEALTH-2026-9812',
    patientMemberId: 'MEM-9812-01',
    careCategory: 'MEDICAL',
    serviceDate: new Date('2026-03-15'),
  });
  assert(eligibleResult.isEligible === true, 'Eleanor Vance eligible for MEDICAL on 2026-03-15');
  assert(eligibleResult.deductibleRemaining === 1200, 'Remaining family deductible is $1,200');

  // Non-existent member rejection
  const ineligibleMember = await policyService.verifyEligibility({
    familyPolicyNumber: 'POL-HEALTH-2026-9812',
    patientMemberId: 'MEM-UNKNOWN-99',
    careCategory: 'MEDICAL',
    serviceDate: new Date('2026-03-15'),
  });
  assert(ineligibleMember.isEligible === false, 'Unknown member correctly rejected as ineligible');

  // Expired date rejection
  const expiredDateCheck = await policyService.verifyEligibility({
    familyPolicyNumber: 'POL-HEALTH-2026-9812',
    patientMemberId: 'MEM-9812-01',
    careCategory: 'MEDICAL',
    serviceDate: new Date('2027-05-01'), // After policy ends 2026-12-31
  });
  assert(expiredDateCheck.isEligible === false, 'Service date beyond policy period rejected');

  console.log('\n--- TEST BLOCK 4: Stage 1 Case Initialization & Workbasket Task ---');
  const initResult = await caseService.initializeCase({
    policyNumber: 'POL-HEALTH-2026-9812',
    memberId: 'MEM-9812-01',
    careLine: 'MEDICAL',
    timingType: 'POST_SERVICE',
    incidentDate: new Date('2026-03-15'),
    actor: requesterActor,
  });
  const caseId = initResult.caseRecord.caseId;
  assert(initResult.caseRecord.currentStage === 1, 'Case initialized at Stage 1');
  assert(initResult.caseRecord.status === 'ACTIVE', 'Case status is ACTIVE');

  const intakeTasks = await taskService.getByWorkbasket('INTAKE');
  const caseTask = intakeTasks.find((t) => t.caseId === caseId);
  assert(!!caseTask, 'Auto-generated INTAKE workbasket task created for case');

  console.log('\n--- TEST BLOCK 5: Stage 2 Claim Intake & Duplicate Detection ---');
  // 5.1 Intake unique claim
  const claimData = {
    claimId: `CLM-TEST-${Date.now()}`,
    providerNpi: '1982736450',
    providerName: 'St. Jude Metropolitan Hospital',
    dateOfServiceStart: new Date('2026-03-15'),
    dateOfServiceEnd: new Date('2026-03-16'),
    diagnosisCodes: ['I21.0'],
    totalBilledAmount: 6400,
    priorAuthNumber: 'AUTH-2026-4412',
    items: [
      {
        itemId: 'ITEM-001',
        procedureCode: 'CPT-99223',
        description: 'Initial hospital care, inpatient high complexity',
        serviceDate: new Date('2026-03-15'),
        billedAmount: 4200,
      },
      {
        itemId: 'ITEM-002',
        procedureCode: 'CPT-99232',
        description: 'Subsequent hospital care, inpatient',
        serviceDate: new Date('2026-03-16'),
        billedAmount: 2200,
      },
    ],
  };

  const intakeResult = await caseService.intakeClaim(caseId, claimData, requesterActor);
  assert(intakeResult.caseRecord.isDuplicate === false, 'Unique claim passed duplicate check');
  assert(intakeResult.caseRecord.currentStage === 2, 'Case advanced to Stage 2');
  assert(intakeResult.caseRecord.isDeficient === true, 'Deficiency flag raised requiring supporting evidence');

  // 5.2 Exact duplicate check test (historical claim)
  const exactDupCheck = await claimService.checkDuplicate({
    claimId: 'CLM-HIST-2026-8801',
    npi: '1982736450',
    memberId: 'MEM-9812-01',
    serviceStartDate: new Date('2026-02-10'),
    totalBilledAmount: 4850,
  });
  assert(exactDupCheck.exactClaimIdMatch === true, 'Exact Duplicate detected on CLM-HIST-2026-8801');

  // 5.3 Composite duplicate check test (different claim ID but same provider + member + date + amount)
  const compositeDupCheck = await claimService.checkDuplicate({
    claimId: 'CLM-DIFFERENT-ID-999',
    npi: '1982736450',
    memberId: 'MEM-9812-01',
    serviceStartDate: new Date('2026-02-10'),
    totalBilledAmount: 4850,
  });
  assert(compositeDupCheck.compositeMatch === true, 'Composite Duplicate detected on identical billing parameters');

  console.log('\n--- TEST BLOCK 6: Stage 3 Evidence & DCN Audit ---');
  // Mint DCN Evidence
  const mintedEvidence = await evidenceService.mintEvidence({
    caseId,
    claimId: claimData.claimId,
    documentType: 'UB04_CMS1450',
    fileName: 'hospital_ub04_intake_eleanor.pdf',
    fileSizeBytes: 248910,
    actor: requesterActor,
  });
  assert(mintedEvidence.dcn.startsWith('DCN-'), `Document Control Number minted: ${mintedEvidence.dcn}`);
  assert(mintedEvidence.verificationStatus === 'PENDING_AUDIT', 'Evidence status is PENDING_AUDIT');
  assert(mintedEvidence.sha256Checksum.length === 64, 'SHA-256 cryptographic checksum verified');

  // Gating violation test: Cannot advance to Stage 4 while unverified
  let gatingViolated = false;
  try {
    await caseService.advanceStage(caseId, 4, requesterActor);
  } catch (err: any) {
    gatingViolated = true;
  }
  assert(gatingViolated, 'Gating rule prevented premature advancement to Stage 4 without verified DCN');

  // Verify evidence
  const verifiedEvidence = await evidenceService.verifyEvidence(
    mintedEvidence.dcn,
    'VERIFIED',
    true,
    'All hospital billing codes match UB-04 schedule',
    {
      userId: doctorLogin!.user.userId,
      fullName: doctorLogin!.user.fullName,
      role: 'OPERATIONS_ANALYST',
    }
  );
  assert(verifiedEvidence?.verificationStatus === 'VERIFIED', 'DCN evidence verified successfully');

  // Advance to Stage 4
  const stage4Case = await caseService.advanceStage(caseId, 4, requesterActor);
  assert(stage4Case.currentStage === 4, 'Case advanced to Stage 4 Clinical & Fraud Adjudication');
  assert(stage4Case.isDeficient === false, 'Deficiency cleared upon verification');

  console.log('\n--- TEST BLOCK 7: Stage 4 Clinical Review & Heuristic Fraud Scoring ---');
  const fraudActor = {
    userId: doctorLogin!.user.userId,
    fullName: doctorLogin!.user.fullName,
    role: 'OPERATIONS_ANALYST',
  };

  const fraudAssessment = await fraudService.evaluateClaim(caseId, claimData.claimId, fraudActor);
  assert(fraudAssessment.riskScore > 0, `Heuristic fraud score calculated: ${fraudAssessment.riskScore}/100`);
  assert(fraudAssessment.flags.length > 0, `Fraud flags identified: ${fraudAssessment.flags.map((f) => f.ruleName).join(', ')}`);

  // Physician clinical review & CPT down-coding
  const doctorActor = {
    userId: doctorLogin!.user.userId,
    fullName: doctorLogin!.user.fullName,
    role: doctorLogin!.user.role,
  };

  const clinicalResult = await doctorService.submitClinicalReview({
    caseId,
    claimId: claimData.claimId,
    doctorProfileId: 'DOC-PROF-9921',
    clinicalRationale: 'CPT-99223 downcoded to CPT-99222 due to moderate medical decision making in charts.',
    preliminaryReserveLock: 4500,
    decisions: [
      {
        itemId: 'ITEM-001',
        adjudicationStatus: 'MODIFIED_CODE',
        reclassifiedProcedureCode: 'CPT-99222',
        reclassifiedReason: 'Inpatient charts indicate level 2 complexity rather than level 3.',
        approvedAmount: 2800,
      },
      {
        itemId: 'ITEM-002',
        adjudicationStatus: 'APPROVED',
        approvedAmount: 2200,
      },
    ],
    actor: doctorActor,
  });

  assert(clinicalResult.totalApproved === 5000, 'Physician approved $5,000 after down-coding CPT-99223');
  assert(clinicalResult.reclassificationsCount === 1, '1 procedure code reclassified');

  console.log('\n--- TEST BLOCK 8: Stage 5 Settlement Disbursement & Stage 6 Closure ---');
  // First demonstrate that attempting to advance with an open fraud investigation triggers gating violation:
  let fraudGatingViolated = false;
  try {
    await caseService.advanceStage(caseId, 5, doctorActor);
  } catch (err: any) {
    fraudGatingViolated = true;
  }
  assert(fraudGatingViolated, 'Gating rule strictly blocked advancement to Stage 5 during active SIU fraud investigation');

  // SIU Analyst completes investigation and clears hold
  const clearedAssessment = await fraudService.clearFraudHold(
    fraudAssessment.assessmentId,
    'Investigation completed: hospital confirmed itemized chart records and separate encounter notes. Hold cleared.',
    fraudActor
  );
  assert(clearedAssessment?.isUnderInvestigation === false, 'SIU Fraud Hold cleared after audit review');

  // Now advance to Stage 5 successfully
  const stage5Case = await caseService.advanceStage(caseId, 5, doctorActor);
  assert(stage5Case.currentStage === 5, 'Case successfully advanced to Stage 5 Settlement & Disbursement');

  // Disburse settlement
  const settledCase = await caseService.disburseSettlement(
    caseId,
    'EFT_DIRECT_DEPOSIT',
    'EFT-TRACE-99281920',
    doctorActor
  );

  assert(settledCase.currentStage === 6, 'Case finalized and transitioned to Stage 6 Closed & Archived');
  assert(settledCase.status === 'APPROVED', 'Final case status is APPROVED');
  assert(!!settledCase.settlementVoucher, 'Settlement voucher generated');
  assert(settledCase.settlementVoucher?.checkNumberOrEft === 'EFT-TRACE-99281920', 'EFT trace number recorded');
  // Net payout = 5000 - 1200 (deductible) - 40 (copay) = 3760
  assert(
    settledCase.financialSummary.settlementAmount === 3760,
    `Net settlement payout calculated: $${settledCase.financialSummary.settlementAmount} (Approved $5000 - Deductible $1200 - Copay $40)`
  );

  console.log('\n--- TEST BLOCK 9: Immutable Event Audit Trail Verification ---');
  const timeline = await eventService.getTimeline(caseId);
  assert(timeline.length >= 8, `Event stream contains ${timeline.length} sequential immutable events`);

  // Verify sequence numbers are strictly 1..N
  let isStrictlySequential = true;
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].sequenceNumber !== i + 1) {
      isStrictlySequential = false;
      break;
    }
  }
  assert(isStrictlySequential, 'Event sequence numbers are strictly 1..N continuous and immutable');

  const eventTypes = timeline.map((e) => e.eventType);
  assert(eventTypes.includes('CASE_CREATED'), 'Timeline includes CASE_CREATED');
  assert(eventTypes.includes('POLICY_VERIFIED'), 'Timeline includes POLICY_VERIFIED');
  assert(eventTypes.includes('DUPLICATE_CHECK_PASSED'), 'Timeline includes DUPLICATE_CHECK_PASSED');
  assert(eventTypes.includes('DCN_MINTED'), 'Timeline includes DCN_MINTED');
  assert(eventTypes.includes('EVIDENCE_VERIFIED'), 'Timeline includes EVIDENCE_VERIFIED');
  assert(eventTypes.includes('PROCEDURE_RECLASSIFIED'), 'Timeline includes PROCEDURE_RECLASSIFIED');
  assert(eventTypes.includes('CLINICAL_ADJUDICATED'), 'Timeline includes CLINICAL_ADJUDICATED');
  assert(eventTypes.includes('SETTLEMENT_DISBURSED'), 'Timeline includes SETTLEMENT_DISBURSED');
  assert(eventTypes.includes('CASE_CLOSED'), 'Timeline includes CASE_CLOSED');

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed with unhandled error:', err);
  process.exit(1);
});
