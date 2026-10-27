# OmniClaim Health: Complete Enterprise Architecture, Database Dictionary, Auth Engine & REST API Catalog

This document is the definitive, production-ready specification for OmniClaim Health—an enterprise healthcare claims orchestration platform built on an immutable event-sourcing architecture.

---

# Part 1: Authentication, Session Management & Backend User Identification

OmniClaim implements an enterprise-grade **JWT (JSON Web Token) + RBAC (Role-Based Access Control)** authentication engine with cryptographic verification and tamper-proof audit event attribution.

---

## 1.1 Authentication & Identification Flow

```
[ Frontend Client ] 
        │
        │ 1. POST /api/auth/login { username, password }
        ▼
[ Auth Controller ] ──Query 'users' collection──▶ [ MongoDB ]
        │                                              │
        │ 2. bcrypt.compare(password, passwordHash)    │ Returns user document
        ▼
[ Token Signer ] 
        │ 3. jwt.sign({ sub, userId, role, workbaskets, doctorProfileId }, JWT_SECRET, { expiresIn: '8h' })
        ▼
[ Frontend Client ] ──Receives JWT + User Profile──▶ Stored in Memory / Secure Storage
        │
        │ 4. Subsequent API Request + Header: [ Authorization: Bearer <JWT> ]
        ▼
[ authenticateJWT Middleware ]
        │ 5. jwt.verify(token, JWT_SECRET)
        │ 6. Mounts verified claims onto Express req.user context
        ▼
[ RBAC Guard: requireRole(...) / requireWorkbasket(...) ]
        │ 7. Evaluates req.user.role & req.user.authorizedWorkbaskets
        ▼
[ Business Route Handler ]
        │ 8. Executes domain logic (Stage transition, Reserve calculation)
        │ 9. Appends event to 'case_events' extracting actor directly from req.user (Never client body!)
        ▼
[ Immutable Event Store ] (actor: { userId: req.user.userId, name: req.user.fullName, role: req.user.role })
```

---

## 1.2 User Identity Token Payload (JWT Claims)
Upon successful credential verification, the backend issues an HMAC-SHA256 token containing:
```json
{
  "sub": "65f8a192bc14a001",
  "userId": "usr_dr_chen",
  "username": "doctor.chen@omniclaim.internal",
  "fullName": "Dr. Sarah Chen, MD",
  "role": "DOCTOR_APPROVER",
  "department": "Clinical Review & Adjudication",
  "authorizedWorkbaskets": ["CLINICAL_REVIEW", "SETTLEMENT"],
  "doctorProfileId": "DOC-DR-CHEN",
  "iat": 1774514400,
  "exp": 1774543200
}
```

---

## 1.3 Pre-Seeded Enterprise Role Credentials

| Role | Username | Initial Password | Authorized Workbaskets | Primary Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Business Requester** | `requester@omniclaim.internal` | `RequesterPass2026!` | `INTAKE_SUBMISSION` | Policy lookup, claim intake, DCN upload, deficiency response |
| **Process Owner** | `process.owner@omniclaim.internal` | `ProcessOwner2026!` | `INTAKE`, `EVIDENCE_DEFICIENCY` | Workbasket triage, duplicate resolution, DCN audit, milestone stage progression |
| **Doctor Approver** | `doctor.chen@omniclaim.internal` | `DoctorChen2026!` | `CLINICAL_REVIEW`, `SETTLEMENT` | Medical necessity evaluation, procedure reclassification, clinical sign-off |
| **Operations Analyst** | `analyst@omniclaim.internal` | `AnalystPass2026!` | `FRAUD_SIU`, `AUDIT_METRICS` | Fraud score decomposition, audit logs, SLA monitoring, KPI reports |
| **System Admin** | `admin@omniclaim.internal` | `AdminSuper2026!` | `ALL_WORKBASKETS` | BSON document explorer, Mongoose schema exporter, benefit tables, rule engine |

---

## 1.4 Production Backend Implementation Code

### Middleware: `auth.middleware.ts`
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedUser {
  sub: string;
  userId: string;
  username: string;
  fullName: string;
  role: "BUSINESS_REQUESTER" | "PROCESS_OWNER" | "DOCTOR_APPROVER" | "OPERATIONS_ANALYST" | "SYSTEM_ADMIN";
  department: string;
  authorizedWorkbaskets: string[];
  doctorProfileId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "omniclaim_production_secret_key_2026";

/**
 * Validates the Authorization: Bearer <token> header and mounts req.user.
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Missing or malformed Bearer token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid, expired, or tampered token." });
  }
}

/**
 * Enforces Role-Based Access Control (RBAC).
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied: Role '${req.user?.role}' is not authorized for this operation.` 
      });
    }
    next();
  };
}

/**
 * Enforces Workbasket Queue Access.
 */
export function requireWorkbasket(basketName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    const hasAccess = req.user.authorizedWorkbaskets.includes(basketName) || 
                      req.user.authorizedWorkbaskets.includes("ALL_WORKBASKETS");
    if (!hasAccess) {
      return res.status(403).json({ 
        error: `Access Denied: User is not authorized to access the '${basketName}' workbasket.` 
      });
    }
    next();
  };
}
```

### Controller: `auth.controller.ts`
```typescript
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../db/mongo";

const JWT_SECRET = process.env.JWT_SECRET || "omniclaim_production_secret_key_2026";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const db = getDb();
  const user = await db.collection("users").findOne({ username: username.toLowerCase().trim() });
  
  if (!user || user.status !== "ACTIVE") {
    return res.status(401).json({ error: "Invalid username or password, or account inactive." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const tokenPayload = {
    sub: user._id.toString(),
    userId: user.userId,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    department: user.department,
    authorizedWorkbaskets: user.authorizedWorkbaskets,
    doctorProfileId: user.doctorProfileId
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "8h" });

  res.status(200).json({
    token,
    user: {
      userId: user.userId,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      authorizedWorkbaskets: user.authorizedWorkbaskets,
      doctorProfileId: user.doctorProfileId
    }
  });
}
```

---

# Part 2: Complete Database Schema Dictionary (10 Collections)

---

### Collection 1: `users`
**Purpose**: System user identities, authentication credentials, RBAC roles, and assigned operational workbaskets.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `userId` | String | Unique Index | No | Business user ID (e.g., `usr_dr_chen`, `usr_intake_02`) |
| `username` | String | Unique Index | No | Login email address (e.g., `doctor.chen@omniclaim.internal`) |
| `passwordHash` | String | - | No | Bcrypt salted hash (Cost factor 12) |
| `fullName` | String | - | No | Display name of the user |
| `role` | Enum String | Index | No | `BUSINESS_REQUESTER`, `PROCESS_OWNER`, `DOCTOR_APPROVER`, `OPERATIONS_ANALYST`, `SYSTEM_ADMIN` |
| `department` | String | - | No | Organizational unit (e.g., `Clinical Review`, `Claims Intake`) |
| `authorizedWorkbaskets` | Array[Enum] | - | No | Array of queues: `INTAKE`, `EVIDENCE_DEFICIENCY`, `CLINICAL_REVIEW`, `FRAUD_SIU`, `SETTLEMENT`, `ALL_WORKBASKETS` |
| `doctorProfileId` | String | Foreign Key -> `doctor_profiles.doctorId` | Yes | Populated only when role is `DOCTOR_APPROVER` |
| `status` | Enum String | Index | No | `ACTIVE`, `SUSPENDED`, `INACTIVE` (Default: `ACTIVE`) |
| `createdAt` | ISODate | - | No | Record creation timestamp |
| `updatedAt` | ISODate | - | No | Last modification timestamp |

---

### Collection 2: `customers`
**Purpose**: Master registry of family-level insurance subscribers and their dependent beneficiaries.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `familyPolicyNumber` | String | Unique Index | No | Shared family policy reference (e.g., `FAM-98234-MED`) |
| `primarySubscriber.memberId` | String | Unique Index | No | Primary subscriber ID (e.g., `MEM-001`) |
| `primarySubscriber.firstName` | String | - | No | Subscriber first name |
| `primarySubscriber.lastName` | String | - | No | Subscriber last name |
| `primarySubscriber.dob` | ISODate | - | No | Date of birth (YYYY-MM-DD) |
| `primarySubscriber.gender` | Enum String | - | No | `MALE`, `FEMALE`, `OTHER`, `UNDISCLOSED` |
| `primarySubscriber.relationship` | String | - | No | Constant: `PRIMARY` |
| `primarySubscriber.ssnLast4` | String | - | Yes | Last 4 digits of SSN for verification |
| `dependents` | Array[Object] | - | No | Covered family members (spouse, children) |
| `dependents[].memberId` | String | Index | No | Unique member ID within family (e.g., `MEM-002`) |
| `dependents[].firstName` | String | - | No | Dependent first name |
| `dependents[].lastName` | String | - | No | Dependent last name |
| `dependents[].dob` | ISODate | - | No | Dependent date of birth |
| `dependents[].gender` | Enum String | - | No | Dependent gender |
| `dependents[].relationship` | Enum String | - | No | `SPOUSE`, `CHILD`, `DOMESTIC_PARTNER`, `OTHER` |
| `contact.email` | String | - | No | Policyholder contact email |
| `contact.phone` | String | - | No | Policyholder phone number |
| `contact.address.street` | String | - | No | Street address |
| `contact.address.city` | String | - | No | City |
| `contact.address.state` | String | - | No | 2-letter state code |
| `contact.address.zip` | String | - | No | Postal zip code |
| `status` | Enum String | Index | No | `ACTIVE`, `TERMINATED`, `PENDING` |
| `createdAt` | ISODate | - | No | Ingestion timestamp |
| `updatedAt` | ISODate | - | No | Record update timestamp |

---

### Collection 3: `policies`
**Purpose**: Defines health benefit plans, family financial thresholds, category copays/coinsurance, and exclusion rules.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `policyNumber` | String | Unique Index | No | Family policy number linking to `customers.familyPolicyNumber` |
| `planCode` | String | Index | No | Internal product code (e.g., `GOLD-PPO-2026`) |
| `planName` | String | - | No | Commercial plan title |
| `status` | Enum String | Index | No | `ACTIVE`, `EXPIRED`, `CANCELLED` |
| `effectiveDate` | ISODate | Index | No | Policy active start date (Midnight UTC) |
| `expirationDate` | ISODate | Index | No | Policy expiration date (23:59:59 UTC) |
| `networkTier` | Enum String | - | No | `IN_NETWORK`, `OUT_OF_NETWORK`, `TIER_1_PREFERRED` |
| `familyFinancials.annualDeductible` | Decimal128 | - | No | Total annual family deductible (e.g., `3000.00`) |
| `familyFinancials.deductibleMetToDate` | Decimal128 | - | No | Cumulative deductible paid across family |
| `familyFinancials.outOfPocketMax` | Decimal128 | - | No | Maximum yearly out-of-pocket obligation |
| `familyFinancials.outOfPocketMetToDate` | Decimal128 | - | No | Cumulative OOP met to date |
| `categoryCoverages` | Array[Object] | - | No | Benefit schedules by care line |
| `categoryCoverages[].category` | Enum String | - | No | `MEDICAL`, `PHARMACY`, `PRESCRIPTION`, `BEHAVIORAL_HEALTH` |
| `categoryCoverages[].copay` | Decimal128 | - | No | Fixed patient copayment per service |
| `categoryCoverages[].coinsurancePercentage` | Integer | - | No | Patient coinsurance percentage (e.g., `20` for 80/20 plan) |
| `categoryCoverages[].maxLifetimeBenefit` | Decimal128 | - | No | Cap on lifetime reimbursement |
| `categoryCoverages[].requiresPreAuth` | Boolean | - | No | True if all procedures in category require prior authorization |
| `exclusions` | Array[String] | - | No | Excluded CPT/HCPCS/Rx codes (e.g., `CPT-99999-COSMETIC`) |
| `preAuthRequiredProcedures` | Array[String] | - | No | Specific procedure codes requiring Prior Authorization |
| `createdAt` | ISODate | - | No | Record creation timestamp |

---

### Collection 4: `cases`
**Purpose**: Central root aggregate entity coordinating stages 1 through 6, financial summaries, and workbasket assignments.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `caseNumber` | String | Unique Index | No | Case identifier (e.g., `CASE-2026-00412`) |
| `claimId` | String | Foreign Key -> `claims.claimId` | Yes | Attached once claim intake occurs at Stage 2 |
| `title` | String | - | No | Brief descriptive title of the case |
| `currentStage` | Integer (1-6) | Index | No | **1**: Policy/Elig, **2**: Claim Intake, **3**: Evidence DCN, **4**: Clinical/Fraud, **5**: Settlement, **6**: Closed |
| `stageName` | Enum String | - | No | Stage enum matching stages 1-6 |
| `status` | Enum String | Index | No | `OPEN`, `ELIGIBILITY_VERIFIED`, `INTAKE_ACCEPTED`, `PENDING_EVIDENCE`, `PENDING_CLINICAL`, `CLINICALLY_APPROVED`, `SETTLEMENT_AUTHORIZED`, `CLOSED`, `REJECTED` |
| `priority` | Enum String | Index | No | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `claimType` | Enum String | - | No | `PRE_SERVICE` (Prior Auth) or `POST_SERVICE` (Reimbursement) |
| `careCategory` | Enum String | Index | No | `MEDICAL`, `PHARMACY`, `PRESCRIPTION`, `BEHAVIORAL_HEALTH` |
| `familyPolicyNumber` | String | Foreign Key -> `policies.policyNumber` | No | Associated policy |
| `patientMemberId` | String | Foreign Key -> `customers.dependents[].memberId` | No | Member receiving the care |
| `patientName` | String | - | No | Cached patient full name |
| `currentWorkbasket` | Enum String | Index | No | Active queue: `INTAKE`, `EVIDENCE_DEFICIENCY`, `CLINICAL_REVIEW`, `FRAUD_SIU`, `SETTLEMENT`, `NONE` |
| `assignedUserId` | String | Foreign Key -> `users.userId` | Yes | Assigned intake/adjudication staff |
| `assignedDoctorId` | String | Foreign Key -> `doctor_profiles.doctorId` | Yes | Assigned physician reviewer |
| `stageHistory` | Array[Object] | - | No | Historic log of stages traversed |
| `financialSummary.totalBilled` | Decimal128 | - | No | Sum of billed procedure lines (Default: `0.00`) |
| `financialSummary.allowableAmount` | Decimal128 | - | No | Approved fee schedule total (Default: `0.00`) |
| `financialSummary.preliminaryReserve` | Decimal128 | - | No | Loss reserve held for this claim (Default: `0.00`) |
| `financialSummary.patientCopay` | Decimal128 | - | No | Member copayment obligation |
| `financialSummary.patientCoinsurance` | Decimal128 | - | No | Member coinsurance calculated amount |
| `financialSummary.deductibleApplied` | Decimal128 | - | No | Portion of allowable applied toward remaining family deductible |
| `financialSummary.approvedPayout` | Decimal128 | - | No | Final insurer disbursement amount |
| `financialSummary.disbursementStatus` | Enum String | - | No | `NOT_AUTHORIZED`, `AUTHORIZED`, `DISBURSED`, `VOIDED` |
| `flags.isDuplicateSuspect` | Boolean | Index | No | True if duplicate heuristic tripped |
| `flags.fraudHold` | Boolean | Index | No | True if fraud score > 50 |
| `flags.missingDocumentHold` | Boolean | Index | No | True if mandatory DCN is unverified |
| `createdAt` | ISODate | - | No | Timestamp when case was initialized |
| `updatedAt` | ISODate | - | No | Last update timestamp |

---

### Collection 5: `claims` & `claim_items`
**Purpose**: Clinical service records, institutional provider metadata, diagnoses, and procedure lines.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `claimId` | String | Unique Index | No | Alphanumeric Claim ID (e.g., `CLM-88129`) |
| `caseId` | ObjectId | Foreign Key -> `cases._id` | No | Associated parent case |
| `claimType` | Enum String | - | No | `PRE_SERVICE` or `POST_SERVICE` |
| `careCategory` | Enum String | - | No | `MEDICAL`, `PHARMACY`, `PRESCRIPTION`, `BEHAVIORAL_HEALTH` |
| `provider.npi` | String | Index | No | 10-digit National Provider Identifier (e.g., `1982736450`) |
| `provider.name` | String | - | No | Hospital, Clinic, or Practice name |
| `provider.facilityType` | Enum String | - | No | `INSTITUTIONAL`, `PROFESSIONAL`, `PHARMACY_RETAIL` |
| `provider.taxId` | String | - | Yes | Provider Federal Tax ID |
| `serviceStartDate` | ISODate | Index | No | Clinical service start date |
| `serviceEndDate` | ISODate | - | Yes | Clinical service end date |
| `diagnoses` | Array[Object] | - | No | Array of ICD-10 diagnostic codes: `{ code, description, isPrimary }` |
| `items` | Array[Object] | - | No | Itemized procedure lines |
| `items[].itemId` | String | - | No | Line item identifier (e.g., `ITM-01`, `ITM-02`) |
| `items[].procedureCode` | String | Index | No | CPT/HCPCS/NDC code (e.g., `CPT-29881`, `CPT-99223`) |
| `items[].description` | String | - | No | Procedure narrative |
| `items[].serviceDate` | ISODate | - | No | Date specific line was performed |
| `items[].billedAmount` | Decimal128 | - | No | Fee billed by provider |
| `items[].feeScheduleAllowable` | Decimal128 | - | No | Contracted allowable fee |
| `items[].clinicalReviewStatus` | Enum String | - | No | `PENDING_DOCTOR_REVIEW`, `APPROVED`, `MODIFIED_CODE`, `DENIED` |
| `items[].appliedCodeModifier` | String | - | Yes | Billing modifier (e.g., `25`, `59`, `LT`) |
| `items[].clinicalRationale` | String | - | Yes | Physician clinical justification |
| `items[].adjudicatedAmount` | Decimal128 | - | No | Approved payable amount after review |
| `totalBilledAmount` | Decimal128 | Index | No | Sum of all `items[].billedAmount` |
| `submissionChannel` | Enum String | - | No | `WEB_PROVIDER_PORTAL`, `EDI_837_ELECTRONIC`, `MEMBER_DIRECT` |
| `createdAt` | ISODate | - | No | Ingestion timestamp |

---

### Collection 6: `case_tasks`
**Purpose**: Operational task registry distributed across the 5 workbaskets with SLA monitoring.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `taskId` | String | Unique Index | No | Unique task identifier (e.g., `TSK-90214`) |
| `caseId` | ObjectId | Foreign Key -> `cases._id` | No | Parent case reference |
| `caseNumber` | String | Index | No | Cached human-readable case number |
| `stageNumber` | Integer (1-6) | - | No | Lifecycle stage where task was spawned |
| `workbasket` | Enum String | Index | No | `INTAKE`, `EVIDENCE_DEFICIENCY`, `CLINICAL_REVIEW`, `FRAUD_SIU`, `SETTLEMENT` |
| `taskType` | Enum String | - | No | `DUPLICATE_CLAIM_HOLD`, `DEFICIENCY_DCN_RESOLUTION`, `CLINICAL_NECESSITY_REVIEW`, `FRAUD_SIU_INVESTIGATION`, `SETTLEMENT_APPROVAL` |
| `title` | String | - | No | Actionable task title |
| `description` | String | - | No | Detailed instructions / context |
| `priority` | Enum String | Index | No | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `status` | Enum String | Index | No | `OPEN`, `IN_PROGRESS`, `PENDING`, `RESOLVED`, `COMPLETED`, `ESCALATED` |
| `assignedTo.userId` | String | Foreign Key -> `users.userId` | Yes | Assigned staff user ID |
| `assignedTo.name` | String | - | Yes | Assigned staff full name |
| `assignedTo.role` | Enum String | - | Yes | Role of assignee |
| `requiredDocumentType` | Enum String | - | Yes | If deficiency task, the required document (e.g., `OPERATIVE_NOTES`) |
| `sla.dueAt` | ISODate | Index | No | SLA deadline timestamp |
| `sla.isBreached` | Boolean | - | No | True if `now() > dueAt` and status != `COMPLETED` |
| `resolutionDetails.resolvedBy` | String | - | Yes | User ID who resolved task |
| `resolutionDetails.resolvedAt` | ISODate | - | Yes | Resolution timestamp |
| `resolutionDetails.actionTaken` | String | - | Yes | Narrative of resolution |
| `resolutionDetails.dcnReferenced` | String | Foreign Key -> `case_evidences.dcnId` | Yes | DCN uploaded to clear task |
| `createdAt` | ISODate | - | No | Task spawn timestamp |
| `updatedAt` | ISODate | - | No | Task modification timestamp |

---

### Collection 7: `case_evidences`
**Purpose**: Document repository cataloging clinical proof under formal legal Document Control Numbers (DCN).

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `dcnId` | String | Unique Index | No | Legal Document Control Number (e.g., `DCN-2026-MED-849201`) |
| `caseId` | ObjectId | Foreign Key -> `cases._id` | No | Parent case reference |
| `claimId` | String | Foreign Key -> `claims.claimId` | Yes | Associated claim |
| `documentType` | Enum String | Index | No | `SUPERBILL`, `OPERATIVE_NOTES`, `CHART_NOTES`, `PRIOR_AUTH_FORM`, `LAB_REPORT`, `PHARMACY_RECEIPT` |
| `fileName` | String | - | No | File name (e.g., `arthroscopy_op_report.pdf`) |
| `fileSizeBytes` | Integer | - | No | File size in bytes |
| `sourceChannel` | Enum String | - | No | `PORTAL_UPLOAD`, `EDI_275`, `SECURE_FAX`, `OCR_INTAKE` |
| `sha256Checksum` | String | - | No | 64-char SHA-256 integrity hash |
| `verificationStatus` | Enum String | Index | No | `PENDING_VERIFICATION`, `VERIFIED`, `REJECTED`, `DEFICIENT` |
| `verifiedBy` | String | Foreign Key -> `users.userId` | Yes | Process Owner who verified document |
| `verifiedAt` | ISODate | - | Yes | Verification timestamp |
| `verificationNotes` | String | - | Yes | Auditor notes / reason for rejection |
| `uploadedBy.userId` | String | Foreign Key -> `users.userId` | No | Submitting user ID |
| `uploadedBy.name` | String | - | No | Submitting user name |
| `uploadedBy.role` | Enum String | - | No | Role of submitter |
| `uploadedAt` | ISODate | - | No | Upload timestamp |

---

### Collection 8: `doctor_profiles`
**Purpose**: Authoritative registry of licensed physician reviewers and medical directors.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `doctorId` | String | Unique Index | No | Unique doctor ID (e.g., `DOC-DR-CHEN`) |
| `name` | String | - | No | Full physician title (e.g., `Dr. Sarah Chen, MD`) |
| `npi` | String | Unique Index | No | 10-digit National Provider Identifier |
| `specialty` | String | Index | No | Medical specialty (e.g., `Orthopedic Surgery & Sports Medicine`) |
| `subSpecialties` | Array[String] | - | Yes | Specific sub-specialties |
| `medicalDegrees` | Array[String] | - | No | Educational credentials (`["MD", "MS Bioengineering"]`) |
| `activeStateLicenses` | Array[String] | - | No | Medical board license IDs (`["IL-03619284", "CA-A10982"]`) |
| `clinicalPrivileges` | Array[String] | - | No | Authorized privileges (`PROCEDURE_CODE_RECLASSIFICATION`, etc.) |
| `status` | Enum String | Index | No | `ACTIVE`, `ON_LEAVE`, `INACTIVE` |
| `maxCaseload` | Integer | - | No | Maximum simultaneous review caseload |
| `activeCaseload` | Integer | - | No | Current cases pending doctor review |
| `createdAt` | ISODate | - | No | Profile creation timestamp |

---

### Collection 9: `fraud_assessments`
**Purpose**: Stores exact and composite duplicate detection results and algorithmic fraud risk scores.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `assessmentId` | String | Unique Index | No | Assessment ID (e.g., `FRD-2026-9921`) |
| `caseId` | ObjectId | Foreign Key -> `cases._id` | No | Parent case reference |
| `claimId` | String | Foreign Key -> `claims.claimId` | No | Claim reference |
| `duplicateCheck.isDuplicate` | Boolean | Index | No | True if duplicate threshold breached |
| `duplicateCheck.exactClaimIdMatch` | Boolean | - | No | True if Claim ID already exists |
| `duplicateCheck.compositeFingerprintMatch` | Boolean | - | No | True if NPI + Member + Date + Code + Amount matches existing claim |
| `duplicateCheck.matchedCaseNumber` | String | - | Yes | Case number of duplicate match |
| `duplicateCheck.matchedClaimId` | String | - | Yes | Claim ID of duplicate match |
| `fraudScoring.totalRiskScore` | Integer (0-100) | Index | No | Heuristic score: 0-25 Low, 26-50 Med, >50 High |
| `fraudScoring.riskLevel` | Enum String | Index | No | `LOW`, `MEDIUM`, `HIGH` |
| `fraudScoring.requiresSiuInvestigation` | Boolean | Index | No | True if totalRiskScore > 50 |
| `fraudScoring.evaluatedRules` | Array[Object] | - | No | Array of `{ ruleId, description, triggered, points, detail }` |
| `investigationStatus` | Enum String | - | No | `CLEARED_AUTOMATICALLY`, `PENDING_SIU_REVIEW`, `CONFIRMED_FRAUD`, `DISMISSED_FALSE_POSITIVE` |
| `investigatorNotes` | String | - | Yes | Notes entered by Operations Analyst |
| `evaluatedAt` | ISODate | - | No | Evaluation timestamp |

---

### Collection 10: `case_events`
**Purpose**: Immutable, append-only event log capturing every state mutation, actor, and payload across all cases.

| Field Name | Type | Key / Constraint | Nullable | Description / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | No | Unique MongoDB BSON identifier |
| `caseId` | ObjectId | Foreign Key -> `cases._id` | No | Associated case |
| `caseNumber` | String | Index | No | Human-readable case number |
| `sequenceNumber` | Integer | Index | No | Monotonically increasing counter per case (1, 2, 3...) |
| `eventType` | Enum String | Index | No | Typed event name (e.g., `CLAIM_INTAKE_SUBMITTED`) |
| `previousStage` | Integer (1-6) | - | Yes | Stage before this event |
| `newStage` | Integer (1-6) | - | Yes | Stage after this event |
| `actor.userId` | String | Foreign Key -> `users.userId` | No | Actor ID who triggered event (from `req.user.userId`) |
| `actor.name` | String | - | No | Actor display name (from `req.user.fullName`) |
| `actor.role` | Enum String | - | No | Actor role (from `req.user.role`) |
| `payload` | Object (BSON) | - | No | Full contextual JSON payload of the event |
| `timestamp` | ISODate | Index | No | ISO timestamp of the event |

---

# Part 3: Exhaustive REST API Catalog (Determined Work & Endpoint Mapping)

---

### API 1: User Login & Session Token Generation
- **Endpoint**: `POST /api/auth/login`
- **Determined Work**: Queries `users` by `username`. Compares `password` with stored bcrypt `passwordHash`. If valid, generates a signed JWT containing user ID, role, and authorized workbaskets.
- **Allowed Roles**: Public / Unauthenticated
- **Tables Read**: `users`
- **Tables Written**: None (or system login audit)
- **Request Body**:
  ```json
  {
    "username": "doctor.chen@omniclaim.internal",
    "password": "DoctorChen2026!"
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "usr_dr_chen",
      "username": "doctor.chen@omniclaim.internal",
      "fullName": "Dr. Sarah Chen, MD",
      "role": "DOCTOR_APPROVER",
      "authorizedWorkbaskets": ["CLINICAL_REVIEW", "SETTLEMENT"],
      "doctorProfileId": "DOC-DR-CHEN"
    }
  }
  ```

---

### API 2: Verify Policy & Member Eligibility (Stage 1)
- **Endpoint**: `POST /api/policies/verify-eligibility`
- **Determined Work**: Checks that `familyPolicyNumber` exists and status is `ACTIVE`. Checks that `serviceProposedDate` is between `effectiveDate` and `expirationDate`. Verifies that `patientMemberId` is enrolled in subscriber or dependents list. Calculates remaining family deductible (`annualDeductible - deductibleMetToDate`) and out-of-pocket balance. Checks if care category requires prior authorization.
- **Allowed Roles**: `BUSINESS_REQUESTER`, `PROCESS_OWNER`, `SYSTEM_ADMIN`
- **Tables Read**: `policies`, `customers`
- **Tables Written**: None (read-only verification)
- **Request Body**:
  ```json
  {
    "familyPolicyNumber": "FAM-98234-MED",
    "patientMemberId": "MEM-002",
    "careCategory": "MEDICAL",
    "serviceProposedDate": "2026-03-12"
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "isEligible": true,
    "policySummary": {
      "policyNumber": "FAM-98234-MED",
      "planName": "OmniHealth Comprehensive Gold PPO",
      "status": "ACTIVE",
      "effectiveDate": "2026-01-01T00:00:00Z",
      "expirationDate": "2026-12-31T23:59:59Z",
      "networkTier": "IN_NETWORK"
    },
    "patient": {
      "memberId": "MEM-002",
      "fullName": "Leo Vance",
      "relationship": "CHILD",
      "dob": "2012-09-03"
    },
    "categoryCoverage": {
      "category": "MEDICAL",
      "copay": 35.00,
      "coinsurancePercentage": 20,
      "requiresPreAuth": false
    },
    "financialPosition": {
      "annualDeductible": 3000.00,
      "deductibleMet": 1250.00,
      "deductibleRemaining": 1750.00,
      "outOfPocketMax": 8000.00,
      "outOfPocketRemaining": 5600.00
    }
  }
  ```

---

### API 3: Initialize Master Case (Stage 1 Milestone)
- **Endpoint**: `POST /api/cases/initialize`
- **Determined Work**: Creates the core `cases` document at Stage 1 (`POLICY_ELIGIBILITY_VERIFICATION`). Generates `caseNumber`. Sets status to `ELIGIBILITY_VERIFIED`. Appends sequence 1 into `case_events` extracting actor from `req.user`. Routes case to `INTAKE` workbasket awaiting claim procedure details.
- **Allowed Roles**: `BUSINESS_REQUESTER`, `PROCESS_OWNER`
- **Tables Read**: `policies`, `customers`
- **Tables Written**: `cases` (Insert), `case_events` (Append `CASE_INITIALIZED`)
- **Request Body**:
  ```json
  {
    "familyPolicyNumber": "FAM-98234-MED",
    "patientMemberId": "MEM-002",
    "claimType": "POST_SERVICE",
    "careCategory": "MEDICAL",
    "title": "Post-Service Knee Arthroscopy - Leo Vance"
  }
  ```
- **Response Body (`201 Created`)**:
  ```json
  {
    "caseId": "65f8a192bc14a001",
    "caseNumber": "CASE-2026-00412",
    "currentStage": 1,
    "stageName": "POLICY_ELIGIBILITY_VERIFICATION",
    "status": "ELIGIBILITY_VERIFIED",
    "currentWorkbasket": "INTAKE",
    "nextRequiredAction": "SUBMIT_CLAIM_ITEMS"
  }
  ```

---

### API 4: Ingest Claim Items & Execute Duplicate Check (Stage 2)
- **Endpoint**: `POST /api/cases/:caseId/claims/intake`
- **Determined Work**:
  1. Ingests claim header, provider NPI, ICD-10 diagnoses, and procedure lines into `claims`.
  2. Runs **Duplicate Detection Heuristic**:
     - *Exact Check*: Query `claims` where `claimId == newClaimId`.
     - *Composite Match Check*: Query `claims` where `provider.npi`, `patient.memberId`, `serviceStartDate`, and `items[0].procedureCode` match.
  3. If duplicate found: Sets `flags.isDuplicateSuspect = true` in `cases`, creates `DUPLICATE_CLAIM_HOLD` task in `INTAKE` workbasket, and halts progression.
  4. If duplicate passed: Links `claimId` to `cases`, advances `currentStage` to 2 (`CLAIM_INTAKE_AND_INGESTION`), checks if procedures require mandatory documentation (e.g. CPT-29881 requires `OPERATIVE_NOTES`), spawns initial `case_tasks` in `EVIDENCE_DEFICIENCY` workbasket, and sets case status to `PENDING_EVIDENCE`.
- **Allowed Roles**: `BUSINESS_REQUESTER`, `PROCESS_OWNER`
- **Tables Read**: `cases`, `claims`, `policies`
- **Tables Written**: `claims` (Insert), `cases` (Update claimId, stage, totals), `case_tasks` (Insert deficiency tasks), `case_events` (Append `CLAIM_INTAKE_SUBMITTED`, `DUPLICATE_CHECK_EVALUATED`)
- **Request Body**:
  ```json
  {
    "claimId": "CLM-88129",
    "provider": {
      "npi": "1982736450",
      "name": "Metropolitan Medical Center",
      "facilityType": "INSTITUTIONAL"
    },
    "serviceStartDate": "2026-03-12T08:00:00Z",
    "diagnoses": [
      { "code": "M23.22", "description": "Tear of meniscus, right knee", "isPrimary": true }
    ],
    "items": [
      {
        "itemId": "ITM-01",
        "procedureCode": "CPT-29881",
        "description": "Knee Arthroscopy with meniscectomy",
        "serviceDate": "2026-03-12",
        "billedAmount": 4200.00
      },
      {
        "itemId": "ITM-02",
        "procedureCode": "CPT-99223",
        "description": "Initial hospital care, high complexity",
        "serviceDate": "2026-03-12",
        "billedAmount": 1050.00
      }
    ]
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "claimId": "CLM-88129",
    "caseNumber": "CASE-2026-00412",
    "totalBilledAmount": 5250.00,
    "duplicateCheck": { "isDuplicate": false, "exactMatch": false, "compositeMatch": false },
    "caseStage": 2,
    "stageName": "CLAIM_INTAKE_AND_INGESTION",
    "status": "INTAKE_ACCEPTED",
    "spawnedTasks": [
      {
        "taskId": "TSK-90214",
        "workbasket": "EVIDENCE_DEFICIENCY",
        "title": "Collect Operative Report DCN for CPT-29881",
        "status": "OPEN",
        "slaHoursRemaining": 24
      }
    ]
  }
  ```

---

### API 5: Upload Supporting Document & Mint DCN (Stage 3)
- **Endpoint**: `POST /api/cases/:caseId/evidences`
- **Determined Work**: Ingests file metadata, calculates SHA-256 checksum, mints an official legal Document Control Number (e.g. `DCN-2026-MED-849201`), and inserts into `case_evidences` with status `PENDING_VERIFICATION`. Emits append event with actor extracted from `req.user`.
- **Allowed Roles**: `BUSINESS_REQUESTER`, `PROCESS_OWNER`
- **Tables Read**: `cases`
- **Tables Written**: `case_evidences` (Insert), `case_events` (Append `DCN_EVIDENCE_ATTACHED`)
- **Request Body**:
  ```json
  {
    "documentType": "OPERATIVE_NOTES",
    "fileName": "arthroscopy_op_report.pdf",
    "fileSizeBytes": 2419200,
    "sourceChannel": "PORTAL_UPLOAD",
    "sha256Checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "authoringPhysician": "Dr. Ronald Harris, MD"
  }
  ```
- **Response Body (`201 Created`)**:
  ```json
  {
    "dcnId": "DCN-2026-MED-849201",
    "caseId": "65f8a192bc14a001",
    "documentType": "OPERATIVE_NOTES",
    "verificationStatus": "PENDING_VERIFICATION",
    "uploadedAt": "2026-03-15T11:20:00Z"
  }
  ```

---

### API 6: Verify DCN & Clear Deficiency Task (Stage 3 Progression)
- **Endpoint**: `PUT /api/cases/:caseId/evidences/:dcnId/verify`
- **Determined Work**: Process Owner reviews the uploaded document. If valid, updates `case_evidences.verificationStatus = "VERIFIED"`. Checks whether all required document types are satisfied. If zero deficiencies remain: marks corresponding `case_tasks` as `COMPLETED`, clears `flags.missingDocumentHold`, advances `currentStage` to 4 (`CLINICAL_AND_FRAUD_ADJUDICATION`), and routes case to `CLINICAL_REVIEW` workbasket.
- **Allowed Roles**: `PROCESS_OWNER`, `SYSTEM_ADMIN`
- **Tables Read**: `case_evidences`, `case_tasks`
- **Tables Written**: `case_evidences` (Update status), `case_tasks` (Update to `COMPLETED`), `cases` (Advance stage to 4, update workbasket), `case_events` (Append `DCN_EVIDENCE_VERIFIED`, `STAGE_ADVANCED`)
- **Request Body**:
  ```json
  {
    "verificationStatus": "VERIFIED",
    "notes": "Operative report confirms right knee arthroscopy meniscectomy performed by Dr. Harris."
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "dcnId": "DCN-2026-MED-849201",
    "verificationStatus": "VERIFIED",
    "deficiencyCleared": true,
    "remainingDeficiencies": 0,
    "caseStage": 4,
    "stageName": "CLINICAL_AND_FRAUD_ADJUDICATION",
    "currentWorkbasket": "CLINICAL_REVIEW"
  }
  ```

---

### API 7: Execute Fraud Detection Engine (Stage 4)
- **Endpoint**: `POST /api/cases/:caseId/fraud-assessment`
- **Determined Work**: Executes heuristic rules against provider and claim items:
  1. Fee markup ratio (>2.5x allowable: +30 pts)
  2. Unbundling detection (mutually exclusive codes: +25 pts)
  3. Rapid consecutive billing (>2 claims in 72h: +20 pts)
  4. Out-of-network provider spike (+15 pts)
  Outputs score (0 - 100). If score > 50: sets `flags.fraudHold = true`, spawns `FRAUD_SIU_INVESTIGATION` task in `FRAUD_SIU` workbasket. If score <= 50: marks `CLEARED_AUTOMATICALLY`.
- **Allowed Roles**: `OPERATIONS_ANALYST`, `PROCESS_OWNER`, `SYSTEM_ADMIN`
- **Tables Read**: `cases`, `claims`, `policies`
- **Tables Written**: `fraud_assessments` (Insert), `cases` (Update flags), `case_tasks` (Insert SIU task if high risk), `case_events` (Append `FRAUD_ASSESSMENT_EVALUATED`)
- **Request Body**: `{}`
- **Response Body (`200 OK`)**:
  ```json
  {
    "assessmentId": "FRD-2026-9921",
    "fraudScore": 22,
    "riskLevel": "LOW",
    "requiresSiuInvestigation": false,
    "investigationStatus": "CLEARED_AUTOMATICALLY"
  }
  ```

---

### API 8: Submit Doctor Clinical Adjudication (Stage 4 Completion)
- **Endpoint**: `PUT /api/cases/:caseId/clinical-adjudication`
- **Determined Work**: Licensed physician reviewer reviews medical necessity against DCN records. Reclassifies procedure codes (e.g. CPT-99223 -> CPT-99222) or denies lines. Sets fee schedule allowable totals. Calculates and locks **Preliminary Reserve** in `cases.financialSummary`. Advances `currentStage` to 5 (`SETTLEMENT_AND_DISBURSEMENT`). Routes case to `SETTLEMENT` workbasket.
- **Allowed Roles**: `DOCTOR_APPROVER`
- **Tables Read**: `doctor_profiles`, `claims`
- **Tables Written**: `claims.items` (Update adjudication status & allowable amounts), `cases` (Update stage to 5, lock preliminary reserve, update workbasket), `case_events` (Append `CLINICAL_REVIEW_COMPLETED`, `PRELIMINARY_RESERVE_CALCULATED`, `STAGE_ADVANCED`)
- **Request Body**:
  ```json
  {
    "doctorId": "DOC-DR-CHEN",
    "decision": "CLINICALLY_APPROVED",
    "itemAdjustments": [
      {
        "itemId": "ITM-01",
        "adjudicatedCode": "CPT-29881",
        "clinicalStatus": "APPROVED",
        "clinicalRationale": "Meniscal tear confirmed on MRI and op report. Medically indicated."
      },
      {
        "itemId": "ITM-02",
        "adjudicatedCode": "CPT-99222",
        "clinicalStatus": "MODIFIED_CODE",
        "clinicalRationale": "Chart notes document moderate complexity. Reclassified to 99222."
      }
    ],
    "doctorNotes": "All clinical criteria for outpatient knee arthroscopy satisfied."
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "caseId": "65f8a192bc14a001",
    "decision": "CLINICALLY_APPROVED",
    "totalAllowableAmount": 3650.00,
    "lockedPreliminaryReserve": 3650.00,
    "caseStage": 5,
    "stageName": "SETTLEMENT_AND_DISBURSEMENT",
    "currentWorkbasket": "SETTLEMENT"
  }
  ```

---

### API 9: Authorize Financial Settlement & Disbursement (Stage 5 Completion)
- **Endpoint**: `POST /api/cases/:caseId/settlement/authorize`
- **Determined Work**: Calculates deductible obligations, coinsurance, and patient responsibility. Generates payment voucher (`VOUCH-2026-XXXXX`). Increments `policies.familyFinancials.deductibleMetToDate` and `outOfPocketMetToDate`. Advances `currentStage` to 6 (`CLOSED_AND_ARCHIVED`). Sets status to `CLOSED`.
- **Allowed Roles**: `PROCESS_OWNER`, `DOCTOR_APPROVER`, `SYSTEM_ADMIN`
- **Tables Read**: `cases`, `policies`
- **Tables Written**: `cases.financialSummary` (Update approved payout, disbursementStatus = AUTHORIZED), `policies` (Update deductible accumulator), `cases` (Advance stage to 6, status = CLOSED), `case_events` (Append `SETTLEMENT_AUTHORIZED`, `DISBURSEMENT_VOUCHER_ISSUED`, `CASE_CLOSED_AND_ARCHIVED`)
- **Request Body**:
  ```json
  {
    "approvedPayout": 2892.00,
    "paymentMethod": "ELECTRONIC_FUNDS_TRANSFER",
    "payeeNpi": "1982736450",
    "notes": "Settlement disbursed in accordance with Gold PPO in-network schedule."
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "voucherNumber": "VOUCH-2026-90812",
    "caseNumber": "CASE-2026-00412",
    "financials": {
      "totalBilled": 5250.00,
      "allowableAmount": 3650.00,
      "patientCopay": 35.00,
      "deductibleApplied": 0.00,
      "patientCoinsurance": 723.00,
      "patientTotalResponsibility": 758.00,
      "netInsurerDisbursement": 2892.00
    },
    "caseStage": 6,
    "stageName": "CLOSED_AND_ARCHIVED",
    "status": "CLOSED"
  }
  ```

---

### API 10: Fetch Tasks by Workbasket
- **Endpoint**: `GET /api/workbaskets/:basketName/tasks`
- **Determined Work**: Queries `case_tasks` by queue (`INTAKE`, `EVIDENCE_DEFICIENCY`, `CLINICAL_REVIEW`, `FRAUD_SIU`, `SETTLEMENT`), status, and priority. Calculates real-time SLA hours remaining.
- **Allowed Roles**: All Authenticated Users (scoped to their authorized workbaskets via `requireWorkbasket`)
- **Tables Read**: `case_tasks`
- **Tables Written**: None
- **Response Body (`200 OK`)**:
  ```json
  {
    "workbasket": "EVIDENCE_DEFICIENCY",
    "totalCount": 1,
    "tasks": [
      {
        "taskId": "TSK-90214",
        "caseNumber": "CASE-2026-00412",
        "stageNumber": 3,
        "title": "Collect Operative Report DCN for CPT-29881",
        "priority": "HIGH",
        "status": "OPEN",
        "assignedTo": { "userId": "usr_intake_02", "name": "David Miller" },
        "slaHoursRemaining": 18
      }
    ]
  }
  ```

---

### API 11: Update Task Status & Assignment
- **Endpoint**: `PUT /api/tasks/:taskId/status`
- **Determined Work**: Transitions task status (`OPEN` -> `IN_PROGRESS` -> `RESOLVED` / `ESCALATED`) and assigns to a user. Emits `TASK_STATUS_UPDATED` into `case_events`.
- **Allowed Roles**: `PROCESS_OWNER`, `DOCTOR_APPROVER`, `OPERATIONS_ANALYST`, `SYSTEM_ADMIN`
- **Tables Read**: `case_tasks`
- **Tables Written**: `case_tasks` (Update `status`, `assignedTo`, `updatedAt`), `case_events` (Append)
- **Request Body**:
  ```json
  {
    "status": "IN_PROGRESS",
    "assignedUserId": "usr_intake_02"
  }
  ```

---

### API 12: Fetch Case Event History & Audit Stream
- **Endpoint**: `GET /api/cases/:caseId/events`
- **Determined Work**: Returns the complete immutable event replay log ordered by `sequenceNumber ASC` for time-travel audit verification.
- **Allowed Roles**: `OPERATIONS_ANALYST`, `PROCESS_OWNER`, `SYSTEM_ADMIN`
- **Tables Read**: `case_events`
- **Tables Written**: None
- **Response Body (`200 OK`)**:
  ```json
  {
    "caseId": "65f8a192bc14a001",
    "totalEvents": 5,
    "events": [
      {
        "sequenceNumber": 1,
        "eventType": "CASE_INITIALIZED",
        "actor": { "userId": "usr_requester_01", "name": "Metro Health Billing", "role": "BUSINESS_REQUESTER" },
        "previousStage": null,
        "newStage": 1,
        "payload": { "familyPolicyNumber": "FAM-98234-MED", "memberId": "MEM-002" },
        "timestamp": "2026-03-15T09:00:00Z"
      }
    ]
  }
  ```

---

### API 13: Operations KPI & Adjudication Metrics
- **Endpoint**: `GET /api/metrics/dashboard`
- **Determined Work**: Aggregates throughput analytics: active cases by stage (1-6), auto-adjudication rate (%), average cycle time (hours), queue depths across all 5 workbaskets, and denial reason frequency.
- **Allowed Roles**: `OPERATIONS_ANALYST`, `SYSTEM_ADMIN`
- **Tables Read**: `cases`, `case_tasks`, `claims`
- **Tables Written**: None
- **Response Body (`200 OK`)**:
  ```json
  {
    "activeCasesCount": 42,
    "stageDistribution": { "stage1_policy": 5, "stage2_intake": 8, "stage3_evidence": 12, "stage4_clinical": 9, "stage5_settlement": 6, "stage6_closed": 150 },
    "kpiSummary": { "autoAdjudicationRate": 68.4, "averageTurnaroundHours": 14.2, "slaCompliancePercentage": 96.1, "lossRatio": 71.8 }
  }
  ```

---

### API 14: Export Production Mongoose Schemas & BSON Seed
- **Endpoint**: `GET /api/admin/db/export`
- **Determined Work**: Generates production-ready TypeScript Mongoose Schema files and JSON seed collections for all 10 tables to drop into any backend microservice.
- **Allowed Roles**: `SYSTEM_ADMIN`
- **Tables Read**: Schema metadata from all 10 tables
- **Tables Written**: None

---

You now possess the entire blueprint, the exact code for the Express auth middleware and controllers, all 10 tables, and the 14 REST APIs. All files are permanently saved to `/DATABASE_SCHEMA_AND_API_CATALOG.md` and `omniclaim_system_design_specification.html`.
