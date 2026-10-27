# OmniClaim Health: Enterprise Architecture, DB Design & REST API Specification

A comprehensive, production-grade architectural specification and database design for OmniClaim Health—an event-sourced healthcare claims orchestration platform modeling end-to-end adjudication through Cases, Tasks, and Workbaskets.

> [!IMPORTANT]
> **Stage Sequence Reordering & Key Refinements**
> - **Stage 1 (Policy & Family Eligibility)**: The user starts by entering/selecting the family policy, validating member active status, verifying category benefits (Medical, Pharmacy, Rx, Behavioral Health), and confirming remaining family deductibles *before* submitting claims.
> - **Stage 2 (Claim Intake & Duplicate Check)**: User enters clinical claims with procedure codes and dates of service; system executes immediate exact and composite duplicate detection.
> - **Stage 3 (Evidence & DCN Audit)**: Cataloging clinical documents under Document Control Numbers (DCN) with automated deficiency gating.
> - **Stage 4 (Clinical & Fraud Adjudication)**: Automated fraud risk scoring followed by physician reviewer adjudication and procedure code reclassification.
> - **Stage 5 (Settlement & Disbursement)**: Financial settlement calculation (allowables, deductibles, coinsurance, preliminary reserve updates) and payout voucher authorization.
> - **Stage 6 (Closed & Archived)**: Finalized case seal and permanent immutable audit event stream.
> - **Credentials & RBAC Architecture**: Complete `users` collection design with pre-seeded role credentials, JWT token structure, and permission mapping.
> - **Exhaustive REST API Catalog**: Precise HTTP endpoints, request/response JSON schemas, and event mapping.

---

## 1. Authentication & Role Credentials Architecture

To enforce strict Least-Privilege Role-Based Access Control (RBAC), user identities are managed in the `users` collection. Each user is assigned a specific `role` and one or more authorized `workbaskets`.

### Collection 10: `users` (Authentication & RBAC Master)
```json
{
  "_id": "ObjectId",
  "userId": "usr_dr_chen",
  "username": "sarah.chen@omniclaim.internal",
  "passwordHash": "$2b$12$e8YQz.9kQ1... (bcrypt)",
  "fullName": "Dr. Sarah Chen, MD",
  "role": "DOCTOR_APPROVER",
  "department": "Clinical Review & Adjudication",
  "authorizedWorkbaskets": ["CLINICAL_REVIEW", "SETTLEMENT"],
  "doctorProfileId": "DOC-DR-CHEN",
  "status": "ACTIVE",
  "createdAt": "ISODate"
}
```

### Pre-Seeded Enterprise Role Credentials
For immediate deployment and testing, the application provisions 5 standard credentials:

| Role | Username | Seed Password | Assigned Workbaskets | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Business Requester** | `requester@omniclaim.internal` | `RequesterPass2026!` | `INTAKE_SUBMISSION` | Policy lookup, claim intake, DCN upload, deficiency response |
| **Process Owner** | `process.owner@omniclaim.internal` | `ProcessOwner2026!` | `INTAKE`, `EVIDENCE_DEFICIENCY` | Triage, duplicate resolution, DCN verification, stage progression |
| **Doctor Approver** | `doctor.chen@omniclaim.internal` | `DoctorChen2026!` | `CLINICAL_REVIEW`, `SETTLEMENT` | Medical necessity, procedure reclassification, clinical approval/denial |
| **Operations Analyst** | `analyst@omniclaim.internal` | `AnalystPass2026!` | `FRAUD_SIU`, `AUDIT_METRICS` | Fraud score analysis, SLA audit, event replay, KPI dashboards |
| **System Admin** | `admin@omniclaim.internal` | `AdminSuper2026!` | `ALL_WORKBASKETS` | MongoDB BSON explorer, Mongoose exporter, policy tables, rule configuration |

### JWT Token Payload Structure
When authenticating via `POST /api/auth/login`, the API issues a signed JWT:
```json
{
  "sub": "usr_dr_chen",
  "username": "sarah.chen@omniclaim.internal",
  "fullName": "Dr. Sarah Chen, MD",
  "role": "DOCTOR_APPROVER",
  "workbaskets": ["CLINICAL_REVIEW", "SETTLEMENT"],
  "doctorProfileId": "DOC-DR-CHEN",
  "iat": 1774514400,
  "exp": 1774543200
}
```

---

## 2. The Reordered 6-Stage Case Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Stage 1: Policy & Family Eligibility                            │
│  User inputs/verifies Family Policy ID, verifies Member enrollment, checks deductible  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Policy Verified & Case Initialized
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          Stage 2: Claim Intake & Ingestion                             │
│  User submits claim items, dates of service, CPT/Rx codes; Duplicate Check triggers    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Intake Accepted (Duplicate Check Passed)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           Stage 3: Evidence & DCN Audit                                │
│  Documents uploaded under DCNs (superbills, chart notes); Deficiency Gating holds      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ All Mandatory DCNs Verified
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     Stage 4: Clinical Review & Fraud Adjudication                      │
│  Fraud Engine scores risk; Doctor reviews medical necessity & alters procedure codes   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Clinical Review Approved / Partially Approved
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Stage 5: Settlement & Disbursement                              │
│  Allowable fee applied, deductible calculated, reserve adjusted, payout authorized     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Payment Voucher Issued
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           Stage 6: Closed & Archived                                   │
│  Case finalized, records archived, immutable audit event log sealed                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive REST API Specifications

### Group A: Authentication & Session
#### `POST /api/auth/login`
- **Purpose**: Authenticates user credentials and issues session token.
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
      "fullName": "Dr. Sarah Chen, MD",
      "role": "DOCTOR_APPROVER",
      "authorizedWorkbaskets": ["CLINICAL_REVIEW", "SETTLEMENT"],
      "doctorProfileId": "DOC-DR-CHEN"
    }
  }
  ```

---

### Group B: Stage 1 — Policy & Family Eligibility
#### `POST /api/policies/verify-eligibility`
- **Purpose**: Verifies family policy active status, covered members, and category benefit limits.
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
    "policy": {
      "policyNumber": "FAM-98234-MED",
      "planName": "OmniHealth Comprehensive Gold PPO",
      "status": "ACTIVE",
      "patient": {
        "memberId": "MEM-002",
        "name": "Leo Vance",
        "relationship": "CHILD",
        "dob": "2012-09-03"
      },
      "categoryBenefits": {
        "category": "MEDICAL",
        "copay": 35.00,
        "coinsurancePercentage": 20,
        "requiresPreAuth": false
      },
      "deductibleRemaining": 1750.00,
      "outOfPocketRemaining": 5600.00
    }
  }
  ```

#### `POST /api/cases/initialize`
- **Purpose**: Initializes a new Master Case at Stage 1.
- **Emitted Event**: `CASE_INITIALIZED`
- **Request Body**:
  ```json
  {
    "familyPolicyNumber": "FAM-98234-MED",
    "patientMemberId": "MEM-002",
    "claimType": "POST_SERVICE",
    "careCategory": "MEDICAL",
    "title": "Post-Service Medical Claim - Leo Vance"
  }
  ```
- **Response Body (`201 Created`)**:
  ```json
  {
    "caseId": "65f8a1...101",
    "caseNumber": "CASE-2026-00412",
    "currentStage": 1,
    "stageName": "POLICY_ELIGIBILITY_VERIFICATION",
    "status": "ELIGIBILITY_VERIFIED",
    "nextRequiredAction": "SUBMIT_CLAIM_ITEMS"
  }
  ```

---

### Group C: Stage 2 — Claim Intake & Duplicate Check
#### `POST /api/cases/:caseId/claims/intake`
- **Purpose**: Submits itemized claim lines, provider NPI, dates of service, and executes the duplicate detection engine.
- **Emitted Events**: `CLAIM_INTAKE_SUBMITTED`, `DUPLICATE_CHECK_EVALUATED`, `STAGE_ADVANCED` (to Stage 2 completed).
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
    "serviceEndDate": "2026-03-12T14:30:00Z",
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
    "duplicateCheck": {
      "isDuplicate": false,
      "exactMatch": false,
      "compositeMatch": false,
      "riskScore": 0.0
    },
    "caseStage": 2,
    "stageName": "CLAIM_INTAKE_AND_INGESTION",
    "status": "INTAKE_ACCEPTED",
    "spawnedTasks": [
      {
        "taskId": "TSK-90214",
        "workbasket": "EVIDENCE_DEFICIENCY",
        "title": "Collect Operative Report DCN for CPT-29881",
        "status": "OPEN"
      }
    ]
  }
  ```

---

### Group D: Stage 3 — Evidence & DCN Audit
#### `POST /api/cases/:caseId/evidences`
- **Purpose**: Uploads and catalogs clinical evidence, minting an immutable Document Control Number (DCN).
- **Emitted Event**: `DCN_EVIDENCE_ATTACHED`
- **Request Body (Multipart or JSON Metadata)**:
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
    "caseId": "65f8a1...101",
    "documentType": "OPERATIVE_NOTES",
    "verificationStatus": "PENDING_VERIFICATION",
    "uploadedAt": "2026-03-15T11:20:00Z"
  }
  ```

#### `PUT /api/cases/:caseId/evidences/:dcnId/verify`
- **Purpose**: Process Owner verifies or rejects uploaded DCN document. If all required DCNs are verified, resolves deficiency task and advances to Stage 4.
- **Emitted Event**: `DCN_EVIDENCE_VERIFIED`, `STAGE_ADVANCED` (to Stage 4).
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
    "caseStage": 4,
    "stageName": "CLINICAL_AND_FRAUD_ADJUDICATION"
  }
  ```

---

### Group E: Stage 4 — Clinical & Fraud Adjudication
#### `POST /api/cases/:caseId/fraud-assessment`
- **Purpose**: Triggers the algorithmic fraud detection scoring engine.
- **Emitted Event**: `FRAUD_ASSESSMENT_EVALUATED`
- **Request Body**: `{}`
- **Response Body (`200 OK`)**:
  ```json
  {
    "fraudScore": 22,
    "riskLevel": "LOW",
    "requiresSiuInvestigation": false,
    "flags": [],
    "recommendedRouting": "CLINICAL_REVIEW"
  }
  ```

#### `PUT /api/cases/:caseId/clinical-adjudication`
- **Purpose**: Doctor Approver reviews medical necessity, adjusts procedure codes, and approves/denies lines.
- **Emitted Events**: `CLINICAL_REVIEW_COMPLETED`, `PRELIMINARY_RESERVE_CALCULATED`, `STAGE_ADVANCED` (to Stage 5).
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
        "clinicalRationale": "Chart notes document moderate rather than high complexity initial care. Reclassified to 99222."
      }
    ],
    "doctorNotes": "All clinical criteria for outpatient knee arthroscopy satisfied."
  }
  ```
- **Response Body (`200 OK`)**:
  ```json
  {
    "caseId": "65f8a1...101",
    "adjudicationStatus": "CLINICALLY_APPROVED",
    "preliminaryReserve": 3650.00,
    "caseStage": 5,
    "stageName": "SETTLEMENT_AND_DISBURSEMENT"
  }
  ```

---

### Group F: Stage 5 — Settlement & Disbursement
#### `POST /api/cases/:caseId/settlement/authorize`
- **Purpose**: Computes deductible obligations, applies coinsurance, and authorizes final settlement voucher.
- **Emitted Events**: `SETTLEMENT_AUTHORIZED`, `DISBURSEMENT_VOUCHER_ISSUED`, `STAGE_ADVANCED` (to Stage 6).
- **Request Body**:
  ```json
  {
    "approvedPayout": 2890.00,
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
    "totalBilled": 5250.00,
    "allowableAmount": 3650.00,
    "deductibleApplied": 0.00,
    "patientCopay": 35.00,
    "patientCoinsurance": 725.00,
    "netInsurerPayout": 2890.00,
    "disbursementStatus": "AUTHORIZED",
    "caseStage": 6,
    "stageName": "CLOSED_AND_ARCHIVED",
    "closedAt": "2026-03-15T14:00:00Z"
  }
  ```

---

### Group G: Operational Workbaskets & Tasks
#### `GET /api/workbaskets/:basketName/tasks`
- **Query Params**: `?status=OPEN&priority=HIGH`
- **Response Body (`200 OK`)**:
  ```json
  {
    "workbasket": "EVIDENCE_DEFICIENCY",
    "count": 3,
    "tasks": [
      {
        "taskId": "TSK-90214",
        "caseNumber": "CASE-2026-00412",
        "title": "Collect Operative Report DCN for CPT-29881",
        "priority": "HIGH",
        "status": "OPEN",
        "slaHoursRemaining": 18
      }
    ]
  }
  ```

#### `PUT /api/tasks/:taskId/status`
- **Request Body**:
  ```json
  {
    "status": "IN_PROGRESS",
    "assignedUserId": "usr_intake_02"
  }
  ```

---

## 4. Complete Ready-to-Implement MongoDB Collections (10 Collections)

1. **`users`**: Enterprise identity, bcrypt hash, roles, and workbasket authorizations.
2. **`customers`**: Family subscriber master, dependents (individual member IDs), contact info.
3. **`policies`**: Family coverage limits, deductible/out-of-pocket maximums, copays, category coverage schedules, procedure exclusions, pre-auth requirements.
4. **`doctor_profiles`**: Physician reviewers, NPI, specialties, active state licenses, clinical privileges.
5. **`cases`**: Root aggregate container tracking case number, 6 definite stages, active status, priority, patient, assigned workbasket, assigned doctor, and financial summary.
6. **`claims` & `claim_items`**: Claim header, provider NPI, pre/post service type, ICD-10 diagnoses, and procedure lines (CPT/Rx, service dates, billed fees, allowable fees, review statuses).
7. **`case_tasks`**: Operational work items in 5 workbaskets (`INTAKE`, `EVIDENCE_DEFICIENCY`, `CLINICAL_REVIEW`, `FRAUD_SIU`, `SETTLEMENT`), status lifecycle (`OPEN` -> `COMPLETED`), priorities, SLAs.
8. **`case_evidences`**: Document Control Numbers (DCN) tracking file metadata, type, checksum, source channel, and verification states.
9. **`fraud_assessments`**: Heuristic duplicate checks (exact & composite) and fraud risk scoring matrix (unbundling, fee inflation, frequency spikes).
10. **`case_events`**: Append-only event store capturing timestamped sequence, event types, actors, and state transitions.

---

## 5. Printable System Design & PDF Export Artifact

To provide a permanent, exportable, and printable design manual for stakeholders, we generate a standalone high-resolution HTML/CSS document artifact:
- **Location**: `/.aistudio/artifacts/brain/c11237a2-dd5b-4461-9b3c-4e14826b9f51/omniclaim_system_design_specification.html`
- **Features**: Clean print-media CSS (`@media print`), page break optimization, full schema tables, REST API mapping, sequence diagrams, and one-click "Print to PDF" button.
