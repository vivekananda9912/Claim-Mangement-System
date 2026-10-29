# OmniClaim Health — Enterprise Claims Management System -live at https://claim-mangement-system.onrender.com/

A healthcare claim adjudication and member eligibility operations platform designed for Operations Analysts and Medical Review Physicians.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create or verify your `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
   *(If `MONGODB_URI` is not provided or connection fails, the application automatically uses in-memory mock data so all features work seamlessly).*

3. **Start the Application**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 👥 User Roles & Personas

Switch between roles anytime using the profile pill / **Log Out** button in the top navigation bar:

1. **Operations Analyst** (*Marcus Brody*)
   - Access to **Global Search & Workbasket Queue**
   - Access to **Member Search** (HCID & Household lookup)
   - Access to **Intake Service** (capturing new requests and real-time eligibility lookup)
   - Evidence audit, initial review, duplicate detection, and Stage 05 closeout & settlement.

2. **Doctor Approver** (*Dr. Sarah Chen, MD*)
   - Access to **Clinical Desk** (Physician queue)
   - Dedicated medical necessity evaluation, line-item CPT modification/adjudication, and clinical rationale recording.

---

## 🧭 Navigation & Core Features

The persistent **Top Navigation Bar** remains visible across all screens:

- **🏠 Home Button**: Returns directly to the primary cockpit/queue.
- **🔍 Global Search / Workbasket**:
  - Filter active cases by Case Number, Claim ID, Patient Name, HCID, Care Category, Priority, and Stage.
  - Active cases display a **Pick Case** action.
  - **Resolved / Closed cases display no action buttons in the workbasket view.**
- **👥 Member Search**:
  - Search members by HCID (e.g. `HCID-8492-1001-A`), member name, or policy number.
  - View full household dependents, active coverages, copay schedules, and remaining deductibles.
  - Click **Intake Case for this Member** to start intake directly for any dependent.
- **➕ Intake Service**:
  - Step-by-step wizard to capture new claims.
  - Search the National Healthcare ID (HCID) Eligibility Service.
  - Specify provider NPI, service dates, procedure codes, billed amounts, and supporting documentation.
- **🩺 Clinical Desk** *(Doctor Approver role)*:
  - Adjudicate clinical tasks requiring physician necessity determination.

---

## 📋 The 6-Stage Claims Lifecycle

Every case progresses through 6 standardized stages:

| Stage | Name | Description |
|---|---|---|
| **Stage 01** | **Capture Request** | Case intake, member eligibility verification via HCID gateway, and procedure line item entry. |
| **Stage 02** | **Initial Review** | Member policy limits check and automated duplicate submission audit. |
| **Stage 03** | **Claim & Auth Evidence** | Upload, inspect, and verify supporting medical documents (superbills, chart notes, prior-auth). |
| **Stage 04** | **Decision Stage** | Clinical review task adjudicated by a physician (Approved, Modified, or Denied). |
| **Stage 05** | **Closeout & Settlement** | Financial reconciliation, allowable fee calculation, copay/coinsurance deduction, and voucher disbursement. |
| **Stage 06** | **Resolved** | Case finalized and sealed. **Displays in bold green** across the stepper and status badges. |

---

## 💡 Step-by-Step Usage Instructions

### 1. Ingesting a New Claim (Intake Service)
1. Click **Intake Service** in the top navigation bar (or click the **+ Intake Service** button).
2. Enter an HCID (e.g. `HCID-8492-1001-A` or select the quick preset).
3. Click **Call Lookup Service** to verify coverage and select the patient member.
4. Advance to **Case Details & Billing** to verify or add procedure codes and billed amounts.
5. Review the captured summary and click **Submit & Proceed to Stage 02 Initial Review**.

### 2. Reviewing a Case & Resolving Duplicates
1. Open the case from the **Global Search / Workbasket** by clicking **Pick Case**.
2. Click **Open Review Screen** to verify captured request details against policy limits.
3. If flagged for duplicate submission, review side-by-side claim timestamps and click **Resolve Duplicate (Mark Valid)** to proceed.

### 3. Doctor Review Adjudication
1. Log in or switch role to **Doctor Approver**.
2. In the **Clinical Desk**, select a pending clinical case.
3. Review clinical history, prior auth notes, and medical chart evidence.
4. Choose an overall decision (**Approved**, **Partially Approved**, or **Denied**), enter medical rationale notes, and submit adjudication.

### 4. Final Settlement & Closing a Case
1. Switch back to **Operations Analyst**.
2. Open the case and proceed to **Stage 05 (Closeout & Settlement)**.
3. Click **Launch Stage 05 Closeout Screen**.
4. Review the final payout calculation and click **Authorize Electronic Payment Voucher & Seal Case**.
5. The case transitions to **Stage 06 (Resolved)**:
   - The stage stepper renders **06. Resolved in Green** with a checkmark (`✓`).
   - In the workbasket view, **no action buttons are displayed** for this resolved case.

---

## 🌐 Deployment Notes (Render & Cloud Hosting)

When deploying to platforms such as **Render**:
- The dev/preview server requires host whitelist authorization.
- `vite.config.ts` and `server.ts` are configured with `server.allowedHosts`:
  ```ts
  allowedHosts: ['claim-mangement-system.onrender.com', '.onrender.com']
  ```
- To run production build:
  ```bash
  npm run build
  npm start
  ```
