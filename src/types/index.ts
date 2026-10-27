/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'BUSINESS_REQUESTER'
  | 'PROCESS_OWNER'
  | 'DOCTOR_APPROVER'
  | 'OPERATIONS_ANALYST'
  | 'SYSTEM_ADMIN';

export interface UserPersona {
  role: UserRole;
  title: string;
  name: string;
  department: string;
  badge: string;
  description: string;
}

export type CaseStage =
  | 'CAPTURE_REQUEST'
  | 'INITIAL_REVIEW'
  | 'CLAIM_AUTH_EVIDENCE'
  | 'DECISION_STAGE'
  | 'CLOSEOUT_SETTLEMENT'
  | 'CLOSED_ARCHIVED'
  | 'INTAKE_INGESTION'
  | 'POLICY_ELIGIBILITY'
  | 'EVIDENCE_DCN_AUDIT'
  | 'CLINICAL_FRAUD_ADJUDICATION'
  | 'SETTLEMENT_DISBURSEMENT';

export interface StageDefinition {
  stageNumber: number;
  id: CaseStage;
  label: string;
  description: string;
  requiredTasks: string[];
}

export type CaseStatus =
  | 'INTAKE_NEW'
  | 'IN_REVIEW'
  | 'PENDING_EVIDENCE'
  | 'PENDING_CLINICAL'
  | 'FRAUD_HOLD'
  | 'APPROVED'
  | 'PARTIALLY_APPROVED'
  | 'DENIED'
  | 'SETTLED'
  | 'CLOSED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ClaimType = 'PRE_SERVICE' | 'POST_SERVICE';

export type CareCategory =
  | 'MEDICAL'
  | 'PHARMACY'
  | 'PRESCRIPTION'
  | 'BEHAVIORAL_HEALTH';

export type WorkbasketId =
  | 'INTAKE_TRIAGE'
  | 'EVIDENCE_DEFICIENCY'
  | 'CLINICAL_REVIEW'
  | 'FRAUD_SIU'
  | 'SETTLEMENT_FINANCE';

export interface WorkbasketConfig {
  id: WorkbasketId;
  name: string;
  description: string;
  ownerRole: UserRole;
  colorTheme: string;
  iconName: string;
}

export type TaskStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'RESOLVED'
  | 'COMPLETED'
  | 'ESCALATED';

export type TaskType =
  | 'DUPLICATE_CLAIM_CHECK'
  | 'FAMILY_ELIGIBILITY_CHECK'
  | 'MISSING_DCN_RESOLUTION'
  | 'DOCTOR_CLINICAL_REVIEW'
  | 'FRAUD_INVESTIGATION'
  | 'RESERVE_APPROVAL'
  | 'SETTLEMENT_PAYMENT';

export type DcnDocumentType =
  | 'SUPERBILL'
  | 'CHART_NOTES'
  | 'PRIOR_AUTH_FORM'
  | 'LAB_REPORT'
  | 'PRESCRIPTION_RECEIPT'
  | 'POLICY_SCHEDULE';

export type DcnVerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'DEFICIENT';

export interface CaseEvidence {
  _id?: string;
  dcnId: string; // e.g. DCN-2026-MED-849201
  caseId: string;
  caseNumber: string;
  documentType: DcnDocumentType;
  fileName: string;
  fileSize: string;
  sourceChannel: 'PORTAL_UPLOAD' | 'EDI_837' | 'SECURE_FAX' | 'OCR_INTAKE';
  verificationStatus: DcnVerificationStatus;
  verifiedBy?: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export interface DoctorProfile {
  _id?: string;
  doctorId: string;
  name: string;
  npi: string;
  degrees: string[];
  specialty: string;
  activeStateLicenses: string[];
  status: 'ACTIVE' | 'ON_LEAVE';
  activeReviewCases: number;
  avatarInitials: string;
}

export interface FraudAssessment {
  _id?: string;
  fraudId: string;
  caseId: string;
  claimId: string;
  isDuplicate: boolean;
  duplicateMatchCaseNumber: string | null;
  duplicateMatchDetails?: string;
  fraudScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flaggedRules: string[];
  anomalyIndicators: string[];
  evaluatedAt: string;
}

export interface FamilyMember {
  memberId: string;
  hcid: string; // Unique Healthcare Identifier (HCID) e.g. HCID-8492-1001-A
  firstName: string;
  lastName: string;
  dob: string;
  relationship: 'PRIMARY_SUBSCRIBER' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'DEPENDENT';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  coverageStatus?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface Customer {
  _id: string;
  familyPolicyNumber: string;
  familyHcid: string; // Master Household HCID
  primarySubscriber: FamilyMember;
  dependents: FamilyMember[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

export interface CategoryCoverage {
  category: CareCategory;
  copay: number;
  coinsurancePct: number;
  maxBenefit: number;
  accumulatedPaid: number;
}

export interface Policy {
  _id: string;
  policyNumber: string;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  effectiveDate: string; // ISO
  expirationDate: string; // ISO
  networkType: 'IN_NETWORK' | 'OUT_OF_NETWORK';
  financials: {
    familyDeductible: number;
    familyDeductibleMet: number;
    outOfPocketMax: number;
    outOfPocketMet: number;
  };
  coverages: CategoryCoverage[];
  exclusions: string[]; // List of excluded procedure/drug codes
  requiresPreAuthCodes: string[]; // Procedure codes requiring pre-auth
}

export interface ClaimItem {
  itemId: string;
  code: string; // CPT or HCPCS or NDC
  description: string;
  category: CareCategory;
  startDate: string; // Date of service
  billedAmount: number;
  allowableAmount: number;
  copay: number;
  coinsurance: number;
  eligiblePayout: number;
  clinicalDecision: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'DENIED';
  clinicalRationale?: string;
  modifiedCode?: string;
  denialReasonCode?: string;
}

export interface Claim {
  _id: string;
  claimId: string; // CLM-xxxxx
  caseId: string;
  provider: {
    npi: string;
    name: string;
    facilityType: 'INSTITUTIONAL' | 'PHYSICIAN_GROUP' | 'SPECIALTY_CLINIC';
    address: string;
  };
  serviceDate: string;
  totalBilledAmount: number;
  items: ClaimItem[];
  preAuthNumber?: string;
}

export interface CaseTask {
  _id: string;
  taskId: string;
  caseId: string;
  caseNumber: string;
  stageNumber: number;
  workbasket: WorkbasketId;
  taskType: TaskType;
  title: string;
  priority: PriorityLevel;
  status: TaskStatus;
  assignedTo?: {
    userId: string;
    name: string;
    role: UserRole;
  };
  requiredDocType?: DcnDocumentType;
  slaHoursRemaining: number;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface CaseFinancials {
  totalBilled: number;
  preliminaryReserve: number;
  allowableAmount: number;
  deductibleApplied: number;
  copayApplied: number;
  coinsuranceApplied: number;
  patientResponsibility: number;
  netPayout: number;
}

export interface Case {
  _id: string;
  caseNumber: string; // CASE-2026-xxxxx
  claimId: string;
  title: string;
  currentStage: number; // 1 to 6
  stageName: CaseStage;
  status: CaseStatus;
  priority: PriorityLevel;
  claimType: ClaimType;
  category: CareCategory;
  familyPolicyNumber: string;
  patientMemberId: string;
  patientHcid?: string;
  patientName: string;
  assignedWorkbasket: WorkbasketId;
  assignedDoctorId?: string;
  financials: CaseFinancials;
  missingDocumentTypes: DcnDocumentType[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CaseEvent {
  _id?: string;
  eventId: string;
  caseId: string;
  caseNumber: string;
  sequence: number;
  eventType:
    | 'CASE_CREATED'
    | 'DUPLICATE_CHECK_EVALUATED'
    | 'TASK_SPAWNED'
    | 'TASK_STATUS_CHANGED'
    | 'DCN_ATTACHED'
    | 'DCN_STATUS_UPDATED'
    | 'FRAUD_SCORED'
    | 'STAGE_ADVANCED'
    | 'CLINICAL_REVIEW_SUBMITTED'
    | 'CLAIM_SERVICES_MODIFIED'
    | 'RESERVE_CALCULATED'
    | 'SETTLEMENT_AUTHORIZED'
    | 'CASE_CLOSED';
  actor: {
    role: UserRole;
    userId: string;
    name: string;
  };
  summary: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface StageFeedback {
  caseId: string;
  caseNumber: string;
  fromStage: number;
  toStage: number;
  stageName: string;
  title: string;
  summary: string;
  actor: {
    name: string;
    role: string;
  };
  timestamp: string;
  details?: {
    netPayout?: number;
    reserve?: number;
    dcnId?: string;
    newTaskId?: string;
    newTaskTitle?: string;
    actionTaken?: string;
  };
}
