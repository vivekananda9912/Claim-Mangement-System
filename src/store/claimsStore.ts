/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  UserRole,
  Case,
  Claim,
  CaseTask,
  CaseEvidence,
  FraudAssessment,
  CaseEvent,
  Customer,
  Policy,
  DoctorProfile,
  TaskStatus,
  DcnVerificationStatus,
  DcnDocumentType,
  WorkbasketId,
  StageFeedback,
  CareCategory,
} from '../types';
import {
  USER_PERSONAS,
  INITIAL_CUSTOMERS,
  INITIAL_POLICIES,
  INITIAL_DOCTORS,
  INITIAL_CASES,
  INITIAL_CLAIMS,
  INITIAL_TASKS,
  INITIAL_EVIDENCES,
  INITIAL_FRAUD_ASSESSMENTS,
  INITIAL_EVENTS,
} from '../data/mockData';
import {
  DuplicateCheckRule,
  PolicyEligibilityRule,
  DcnAuditRule,
  FraudScoringRule,
} from '../domain/rules';

class ClaimsEngine {
  private currentRole: UserRole = 'PROCESS_OWNER';
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private policies: Policy[] = [...INITIAL_POLICIES];
  private doctors: DoctorProfile[] = [...INITIAL_DOCTORS];
  private cases: Case[] = [...INITIAL_CASES];
  private claims: Claim[] = [...INITIAL_CLAIMS];
  private tasks: CaseTask[] = [...INITIAL_TASKS];
  private evidences: CaseEvidence[] = [...INITIAL_EVIDENCES];
  private fraudAssessments: FraudAssessment[] = [...INITIAL_FRAUD_ASSESSMENTS];
  private events: CaseEvent[] = [...INITIAL_EVENTS];
  private lastStageFeedback: StageFeedback | null = null;
  private listeners: Set<() => void> = new Set();

  private duplicateRule = new DuplicateCheckRule();
  private eligibilityRule = new PolicyEligibilityRule();
  private dcnRule = new DcnAuditRule();
  private fraudRule = new FraudScoringRule();

  constructor() {
    // Attempt local storage hydration for persistence across refreshes
    try {
      localStorage.removeItem('omniclaim_state_v1');
      localStorage.removeItem('omniclaim_state_v2');
    } catch {}

    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('omniclaim_state_v3') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.cases && parsed.claims) {
          // Verify that cached customers have valid HCIDs across all 5 households
          const hasValidHcid =
            Array.isArray(parsed.customers) &&
            parsed.customers.length >= 5 &&
            parsed.customers.every(
              (c: any) =>
                c.familyHcid &&
                c.primarySubscriber?.hcid &&
                Array.isArray(c.dependents) &&
                c.dependents.every((d: any) => d.hcid)
            );

          this.customers = hasValidHcid ? parsed.customers : [...INITIAL_CUSTOMERS];
          this.policies = hasValidHcid && parsed.policies ? parsed.policies : [...INITIAL_POLICIES];
          this.doctors = parsed.doctors || this.doctors;
          this.cases = parsed.cases || this.cases;
          this.claims = parsed.claims || this.claims;
          this.tasks = parsed.tasks || this.tasks;
          this.evidences = parsed.evidences || this.evidences;
          this.fraudAssessments = parsed.fraudAssessments || this.fraudAssessments;
          this.events = parsed.events || this.events;
          this.currentRole = parsed.currentRole || this.currentRole;
        }
      } catch (e) {
        console.warn('Could not restore cached state, using seeds.');
      }
    }
  }

  private persist() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'omniclaim_state_v3',
          JSON.stringify({
            customers: this.customers,
            policies: this.policies,
            doctors: this.doctors,
            cases: this.cases,
            claims: this.claims,
            tasks: this.tasks,
            evidences: this.evidences,
            fraudAssessments: this.fraudAssessments,
            events: this.events,
            currentRole: this.currentRole,
          })
        );
      }
    } catch (e) {
      // storage quota or incognito
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Getters ---
  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public getCurrentUserPersona() {
    return USER_PERSONAS[this.currentRole];
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    this.persist();
  }

  public getLastStageFeedback(): StageFeedback | null {
    return this.lastStageFeedback;
  }

  public clearStageFeedback(): void {
    this.lastStageFeedback = null;
    this.notify();
  }

  public triggerStageFeedback(feedback: StageFeedback): void {
    this.lastStageFeedback = feedback;
    this.notify();
  }

  /**
   * Realtime Member & Eligibility Lookup Service (Simulates EDI 270/271 & FHIR Directory)
   */
  public searchMembersByHcid(query: string) {
    const raw = (query || '').trim().toLowerCase();
    if (!raw || raw === 'all') {
      return this.customers;
    }

    const q = raw.replace(/\s+/g, ' ');

    const filtered = this.customers.filter((c) => {
      // Check family policy or family HCID
      if (
        c.familyPolicyNumber.toLowerCase().includes(q) ||
        (c.familyHcid && c.familyHcid.toLowerCase().includes(q))
      ) {
        return true;
      }
      // Check primary subscriber
      const p = c.primarySubscriber;
      const primaryFullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      if (
        primaryFullName.includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.memberId.toLowerCase().includes(q) ||
        (p.hcid && p.hcid.toLowerCase().includes(q))
      ) {
        return true;
      }
      // Check dependents (spouse, child, parent)
      return c.dependents.some((d) => {
        const depFullName = `${d.firstName} ${d.lastName}`.toLowerCase();
        return (
          depFullName.includes(q) ||
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.memberId.toLowerCase().includes(q) ||
          (d.hcid && d.hcid.toLowerCase().includes(q)) ||
          d.relationship.toLowerCase().includes(q)
        );
      });
    });

    // If no direct substring match, try numeric core (e.g. "8492" from "HCID-8492-...")
    if (filtered.length === 0) {
      const digits = q.replace(/\D/g, '');
      if (digits.length >= 3) {
        return this.customers.filter((c) => {
          const allHcids = [
            c.familyHcid,
            c.primarySubscriber.hcid,
            ...c.dependents.map((d) => d.hcid),
          ].join(' ');
          return allHcids.includes(digits);
        });
      }
    }

    return filtered;
  }

  public getCustomers() {
    return this.customers;
  }

  public getPolicies() {
    return this.policies;
  }

  public getDoctors() {
    return this.doctors;
  }

  public getCases() {
    return this.cases;
  }

  public getClaims() {
    return this.claims;
  }

  public getEvidences() {
    return this.evidences;
  }

  public getCaseById(caseId: string) {
    return this.cases.find((c) => c._id === caseId);
  }

  public getClaimForCase(caseId: string) {
    return this.claims.find((c) => c.caseId === caseId);
  }

  public getTasksForCase(caseId: string) {
    return this.tasks.filter((t) => t.caseId === caseId);
  }

  public getEvidencesForCase(caseId: string) {
    return this.evidences.filter((e) => e.caseId === caseId);
  }

  public getFraudAssessmentForCase(caseId: string) {
    return this.fraudAssessments.find((f) => f.caseId === caseId);
  }

  public getEventsForCase(caseId: string) {
    return this.events.filter((e) => e.caseId === caseId).sort((a, b) => b.sequence - a.sequence);
  }

  public getAllTasks() {
    return this.tasks;
  }

  public getAllEvents() {
    return [...this.events].sort((a, b) => b.sequence - a.sequence);
  }

  public resetToSeeds() {
    this.customers = [...INITIAL_CUSTOMERS];
    this.policies = [...INITIAL_POLICIES];
    this.doctors = [...INITIAL_DOCTORS];
    this.cases = [...INITIAL_CASES];
    this.claims = [...INITIAL_CLAIMS];
    this.tasks = [...INITIAL_TASKS];
    this.evidences = [...INITIAL_EVIDENCES];
    this.fraudAssessments = [...INITIAL_FRAUD_ASSESSMENTS];
    this.events = [...INITIAL_EVENTS];
    this.currentRole = 'PROCESS_OWNER';
    this.persist();
  }

  // --- Append-Only Event Helper ---
  private appendEvent(
    caseId: string,
    caseNumber: string,
    eventType: CaseEvent['eventType'],
    summary: string,
    payload: Record<string, any>
  ) {
    const caseEvents = this.events.filter((e) => e.caseId === caseId);
    const nextSeq = caseEvents.length + 1;
    const actor = USER_PERSONAS[this.currentRole];

    const newEvent: CaseEvent = {
      _id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventId: `EVT-${Date.now().toString().slice(-6)}`,
      caseId,
      caseNumber,
      sequence: nextSeq,
      eventType,
      actor: {
        role: this.currentRole,
        userId: actor.name,
        name: actor.name,
      },
      summary,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.events.push(newEvent);
  }

  // --- Domain Workflow Actions ---

  /**
   * INTAKE: Create new claim & initialize case through deterministic rules
   */
  public submitClaimCase(params: {
    familyPolicyNumber: string;
    patientMemberId: string;
    patientHcid?: string;
    claimType: 'PRE_SERVICE' | 'POST_SERVICE';
    category: 'MEDICAL' | 'PHARMACY' | 'PRESCRIPTION' | 'BEHAVIORAL_HEALTH';
    claimId: string;
    providerNpi: string;
    providerName: string;
    serviceDate: string;
    items: Array<{
      code: string;
      description: string;
      billedAmount: number;
      category?: 'MEDICAL' | 'PHARMACY' | 'PRESCRIPTION' | 'BEHAVIORAL_HEALTH';
      startDate?: string;
    }>;
    initialEvidenceDocType?: DcnDocumentType;
    initialEvidenceFileName?: string;
  }): { success: boolean; caseId: string; caseNumber: string; message: string } {
    const policy = this.policies.find((p) => p.policyNumber === params.familyPolicyNumber);
    const customer = this.customers.find((c) => c.familyPolicyNumber === params.familyPolicyNumber);

    if (!policy) {
      return { success: false, caseId: '', caseNumber: '', message: 'Policy not found.' };
    }

    // Identify patient name & HCID
    let patientName = 'Unknown Patient';
    let resolvedHcid = params.patientHcid || 'HCID-GEN-9901';
    if (customer) {
      if (customer.primarySubscriber.memberId === params.patientMemberId) {
        patientName = `${customer.primarySubscriber.firstName} ${customer.primarySubscriber.lastName}`;
        resolvedHcid = customer.primarySubscriber.hcid;
      } else {
        const dep = customer.dependents.find((d) => d.memberId === params.patientMemberId);
        if (dep) {
          patientName = `${dep.firstName} ${dep.lastName}`;
          resolvedHcid = dep.hcid;
        }
      }
    }

    // 1. Calculate totals & build claim items
    const billedTotal = params.items.reduce((acc, i) => acc + i.billedAmount, 0);

    // 2. Evaluate Policy Eligibility Rule
    const eligResult = this.eligibilityRule.evaluate({
      policy,
      customer,
      memberId: params.patientMemberId,
      serviceDate: params.serviceDate,
      category: params.category,
    });

    // 3. Evaluate Duplicate Check Rule
    const dupResult = this.duplicateRule.evaluate({
      claimId: params.claimId,
      npi: params.providerNpi,
      memberId: params.patientMemberId,
      serviceDate: params.serviceDate,
      billedTotal,
      existingClaims: this.claims,
      existingCases: this.cases,
    });

    const caseId = `case-${Date.now()}`;
    const caseNumber = `CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const claimItems = params.items.map((i, idx) => {
      // Standard fee schedule estimation
      const allowable = Math.min(i.billedAmount, Math.round(i.billedAmount * 0.75));
      const copay = policy.coverages.find((c) => c.category === params.category)?.copay || 30;
      const coinsurance = Math.round((allowable - copay) * 0.2);
      const eligiblePayout = Math.max(0, allowable - copay - coinsurance);

      return {
        itemId: `ITM-0${idx + 1}`,
        code: i.code,
        description: i.description,
        category: i.category || params.category,
        startDate: i.startDate || params.serviceDate,
        billedAmount: i.billedAmount,
        allowableAmount: allowable,
        copay,
        coinsurance,
        eligiblePayout,
        clinicalDecision: 'PENDING' as const,
      };
    });

    const newClaim: Claim = {
      _id: `claim-${Date.now()}`,
      claimId: params.claimId,
      caseId,
      provider: {
        npi: params.providerNpi,
        name: params.providerName,
        facilityType: 'INSTITUTIONAL',
        address: '100 Medical Center Parkway',
      },
      serviceDate: params.serviceDate,
      totalBilledAmount: billedTotal,
      items: claimItems,
    };

    // Calculate baseline financials
    const totalAllowable = claimItems.reduce((acc, i) => acc + i.allowableAmount, 0);
    const totalCopay = claimItems.reduce((acc, i) => acc + i.copay, 0);
    const totalCoinsurance = claimItems.reduce((acc, i) => acc + i.coinsurance, 0);
    const netPayout = Math.max(0, totalAllowable - totalCopay - totalCoinsurance);

    // Initial Stage is Stage 2: Initial Review (Request Captured in Stage 1)
    const currentStage = 2;
    const stageName: Case['stageName'] = 'INITIAL_REVIEW';
    const status: Case['status'] = 'IN_REVIEW';
    const assignedWorkbasket: WorkbasketId = 'INTAKE_TRIAGE';
    const missingDocs: DcnDocumentType[] = [];

    // Required docs check for stage 3
    if (params.items.some((i) => i.billedAmount > 2000)) {
      missingDocs.push('CHART_NOTES');
    }
    if (params.claimType === 'PRE_SERVICE') {
      missingDocs.push('PRIOR_AUTH_FORM');
    }

    const isDuplicate = !dupResult.passed;

    const newCase: Case = {
      _id: caseId,
      caseNumber,
      claimId: params.claimId,
      title: `${params.claimType === 'PRE_SERVICE' ? 'Pre-Service' : 'Post-Service'} ${params.category} Claim - ${patientName}`,
      currentStage,
      stageName,
      status,
      priority: isDuplicate ? 'URGENT' : billedTotal > 3000 ? 'HIGH' : 'MEDIUM',
      claimType: params.claimType,
      category: params.category,
      familyPolicyNumber: params.familyPolicyNumber,
      patientMemberId: params.patientMemberId,
      patientHcid: resolvedHcid,
      patientName,
      assignedWorkbasket,
      assignedDoctorId: 'DOC-DR-CHEN',
      financials: {
        totalBilled: billedTotal,
        preliminaryReserve: isDuplicate ? 0 : totalAllowable,
        allowableAmount: totalAllowable,
        deductibleApplied: 0,
        copayApplied: totalCopay,
        coinsuranceApplied: totalCoinsurance,
        patientResponsibility: totalCopay + totalCoinsurance,
        netPayout,
      },
      missingDocumentTypes: missingDocs,
      tags: [params.category, params.claimType, isDuplicate ? 'Duplicate Alert' : 'Active'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Commit Case and Claim
    this.cases.unshift(newCase);
    this.claims.unshift(newClaim);

    // Initial event
    this.appendEvent(
      caseId,
      caseNumber,
      'CASE_CREATED',
      `Master Case created via Capture Request for ${params.claimType} ${params.category} claim (${params.claimId}) for patient ${patientName} (${resolvedHcid}) totaling $${billedTotal.toFixed(2)}.`,
      {
        claimId: params.claimId,
        patientName,
        patientHcid: resolvedHcid,
        familyPolicyNumber: params.familyPolicyNumber,
        billedTotal,
      }
    );

    // Natural Analyst Flow: No artificial tasks created for Stage 1 or Stage 2
    // Duplicate event
    this.appendEvent(
      caseId,
      caseNumber,
      'DUPLICATE_CHECK_EVALUATED',
      dupResult.message,
      {
        passed: dupResult.passed,
        severity: dupResult.severity,
        details: dupResult.details,
      }
    );

    // Attach initial evidence if supplied
    if (params.initialEvidenceFileName) {
      const dcnId = `DCN-2026-${params.category.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
      const docType = params.initialEvidenceDocType || 'SUPERBILL';
      const evidence: CaseEvidence = {
        _id: `evi-${Date.now()}`,
        dcnId,
        caseId,
        caseNumber,
        documentType: docType,
        fileName: params.initialEvidenceFileName,
        fileSize: '1.2 MB',
        sourceChannel: 'PORTAL_UPLOAD',
        verificationStatus: 'PENDING',
        uploadedBy: USER_PERSONAS[this.currentRole].name,
        uploadedAt: new Date().toISOString(),
      };
      this.evidences.unshift(evidence);
      this.appendEvent(
        caseId,
        caseNumber,
        'DCN_ATTACHED',
        `Document Control Number generated: ${dcnId} (${docType}).`,
        { dcnId, fileName: params.initialEvidenceFileName }
      );
    }

    // Run Fraud Scoring
    const fraudEval = this.fraudRule.evaluate({
      claim: newClaim,
      policy,
      isDuplicateSignature: isDuplicate,
    });

    const fraudRecord: FraudAssessment = {
      _id: `frd-${Date.now()}`,
      fraudId: `FRD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      caseId,
      claimId: params.claimId,
      isDuplicate,
      duplicateMatchCaseNumber: dupResult.details?.conflictingCaseNumber || null,
      duplicateMatchDetails: dupResult.details?.conflictingClaimId
        ? `Conflicts with ${dupResult.details.conflictingClaimId}`
        : undefined,
      fraudScore: fraudEval.score || 10,
      riskLevel: fraudEval.details?.riskLevel || 'LOW',
      flaggedRules: fraudEval.details?.flags || [],
      anomalyIndicators: fraudEval.details?.anomalies || [],
      evaluatedAt: new Date().toISOString(),
    };
    this.fraudAssessments.unshift(fraudRecord);

    this.appendEvent(
      caseId,
      caseNumber,
      'FRAUD_SCORED',
      fraudEval.message,
      { score: fraudRecord.fraudScore, riskLevel: fraudRecord.riskLevel }
    );

    // Flow proceeds normally to Stage 02 Initial Review without creating intermediate tasks

    this.lastStageFeedback = {
      caseId,
      caseNumber,
      fromStage: 1,
      toStage: 2,
      stageName: 'Stage 02: Initial Review',
      title: `Request Captured · Case Advanced to Stage 02 (Initial Review)`,
      summary: `Claim request captured for patient ${patientName} (${resolvedHcid}). Routed to Stage 02 Initial Review queue for details verification.`,
      actor: {
        name: USER_PERSONAS[this.currentRole].name,
        role: this.currentRole,
      },
      timestamp: new Date().toISOString(),
      details: {
        reserve: totalAllowable,
        actionTaken: 'Request Captured & Initial Review Opened',
      },
    };

    this.persist();
    return {
      success: true,
      caseId,
      caseNumber,
      message: `Case ${caseNumber} initialized successfully.`,
    };
  }

  /**
   * DCN EVIDENCE: Upload documentary evidence and mint DCN
   */
  public uploadEvidence(params: {
    caseId: string;
    documentType: DcnDocumentType;
    fileName: string;
    fileSize: string;
    sourceChannel?: 'PORTAL_UPLOAD' | 'EDI_837' | 'SECURE_FAX' | 'OCR_INTAKE';
    notes?: string;
  }): { success: boolean; dcnId: string } {
    const targetCase = this.cases.find((c) => c._id === params.caseId);
    if (!targetCase) return { success: false, dcnId: '' };

    const dcnId = `DCN-2026-${targetCase.category.slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newEvidence: CaseEvidence = {
      _id: `evi-${Date.now()}`,
      dcnId,
      caseId: params.caseId,
      caseNumber: targetCase.caseNumber,
      documentType: params.documentType,
      fileName: params.fileName,
      fileSize: params.fileSize || '1.8 MB',
      sourceChannel: params.sourceChannel || 'PORTAL_UPLOAD',
      verificationStatus: 'PENDING',
      uploadedBy: USER_PERSONAS[this.currentRole].name,
      uploadedAt: new Date().toISOString(),
      notes: params.notes,
    };

    this.evidences.unshift(newEvidence);

    this.appendEvent(
      params.caseId,
      targetCase.caseNumber,
      'DCN_ATTACHED',
      `Document Control Number minted: ${dcnId} (${params.documentType}) by ${USER_PERSONAS[this.currentRole].name}.`,
      { dcnId, fileName: params.fileName, docType: params.documentType }
    );

    this.persist();
    return { success: true, dcnId };
  }

  /**
   * DCN EVIDENCE: Verify or Reject document by Process Owner
   */
  public verifyEvidence(evidenceId: string, status: DcnVerificationStatus, notes?: string) {
    const evidence = this.evidences.find((e) => e._id === evidenceId);
    if (!evidence) return;

    evidence.verificationStatus = status;
    evidence.verifiedBy = USER_PERSONAS[this.currentRole].name;
    if (notes) evidence.notes = notes;

    const targetCase = this.cases.find((c) => c._id === evidence.caseId);
    if (!targetCase) return;

    this.appendEvent(
      evidence.caseId,
      evidence.caseNumber,
      'DCN_STATUS_UPDATED',
      `Evidence ${evidence.dcnId} (${evidence.documentType}) marked as ${status} by ${USER_PERSONAS[this.currentRole].name}.`,
      { dcnId: evidence.dcnId, status, notes }
    );

    // If verified, check if deficiency task can be resolved
    if (status === 'VERIFIED') {
      const task = this.tasks.find(
        (t) =>
          t.caseId === evidence.caseId &&
          t.taskType === 'MISSING_DCN_RESOLUTION' &&
          t.requiredDocType === evidence.documentType &&
          t.status !== 'COMPLETED'
      );
      if (task) {
        task.status = 'COMPLETED';
        task.resolvedAt = new Date().toISOString();
        task.resolutionNotes = `Resolved via verified DCN ${evidence.dcnId}`;
      }

      // Re-evaluate remaining missing docs
      targetCase.missingDocumentTypes = targetCase.missingDocumentTypes.filter(
        (t) => t !== evidence.documentType
      );

      // If zero missing docs, advance case stage to 4 (Clinical Review)
      if (targetCase.missingDocumentTypes.length === 0 && targetCase.currentStage === 3) {
        targetCase.currentStage = 4;
        targetCase.stageName = 'CLINICAL_FRAUD_ADJUDICATION';
        targetCase.status = 'PENDING_CLINICAL';
        targetCase.assignedWorkbasket = 'CLINICAL_REVIEW';

        // Spawn Doctor Review Task if not already present
        const hasDocTask = this.tasks.some(
          (t) => t.caseId === targetCase._id && t.taskType === 'DOCTOR_CLINICAL_REVIEW'
        );
        if (!hasDocTask) {
          const docTask: CaseTask = {
            _id: `task-${Date.now()}-doc`,
            taskId: `TSK-${Math.floor(10000 + Math.random() * 90000)}`,
            caseId: targetCase._id,
            caseNumber: targetCase.caseNumber,
            stageNumber: 4,
            workbasket: 'CLINICAL_REVIEW',
            taskType: 'DOCTOR_CLINICAL_REVIEW',
            title: `Doctor Clinical Necessity Review: ${targetCase.claimId}`,
            priority: targetCase.priority,
            status: 'OPEN',
            assignedTo: {
              userId: 'usr_dr_chen',
              name: 'Dr. Sarah Chen, MD',
              role: 'DOCTOR_APPROVER',
            },
            slaHoursRemaining: 36,
            createdAt: new Date().toISOString(),
          };
          this.tasks.unshift(docTask);
        }

        this.appendEvent(
          targetCase._id,
          targetCase.caseNumber,
          'STAGE_ADVANCED',
          `Case advanced to Stage 4 (Clinical & Fraud Adjudication) upon DCN verification.`,
          { fromStage: 3, toStage: 4 }
        );

        const activeDocTask = this.tasks.find(
          (t) => t.caseId === targetCase._id && t.taskType === 'DOCTOR_CLINICAL_REVIEW'
        );

        this.lastStageFeedback = {
          caseId: targetCase._id,
          caseNumber: targetCase.caseNumber,
          fromStage: 3,
          toStage: 4,
          stageName: 'Stage 4: Clinical & Fraud Adjudication',
          title: 'Evidence Audit Complete · Advanced to Stage 04',
          summary: `All mandatory Document Control Numbers (DCNs) have been verified. Milestone review task for Dr. Sarah Chen, MD has been dispatched to the Clinical Review Workbasket.`,
          actor: {
            name: USER_PERSONAS[this.currentRole].name,
            role: this.currentRole,
          },
          timestamp: new Date().toISOString(),
          details: {
            dcnId: evidence.dcnId,
            newTaskId: activeDocTask?.taskId,
            newTaskTitle: activeDocTask?.title,
            actionTaken: `Verified DCN ${evidence.dcnId}`,
          },
        };
      }
    }

    this.persist();
  }

  /**
   * TASK: Update task status & assignment
   */
  public updateTaskStatus(taskId: string, status: TaskStatus, notes?: string) {
    const task = this.tasks.find((t) => t._id === taskId || t.taskId === taskId);
    if (!task) return;

    const oldStatus = task.status;
    task.status = status;
    if (notes) task.resolutionNotes = notes;
    if (status === 'COMPLETED' || status === 'RESOLVED') {
      task.resolvedAt = new Date().toISOString();
    }

    this.appendEvent(
      task.caseId,
      task.caseNumber,
      'TASK_STATUS_CHANGED',
      `Task '${task.title}' updated from ${oldStatus} to ${status}.`,
      { taskId: task.taskId, oldStatus, newStatus: status, notes }
    );

    this.persist();
  }

  /**
   * CLINICAL: Doctor reviews medical necessity, adjusts procedure codes, authorizes reserve
   */
  public doctorAdjudicateClaim(params: {
    caseId: string;
    decision: 'APPROVED' | 'PARTIALLY_APPROVED' | 'DENIED';
    itemDecisions: Array<{
      itemId: string;
      clinicalDecision: 'APPROVED' | 'MODIFIED' | 'DENIED';
      modifiedCode?: string;
      clinicalRationale?: string;
    }>;
    doctorNotes: string;
    customReserve?: number;
  }) {
    const targetCase = this.cases.find((c) => c._id === params.caseId);
    const claim = this.claims.find((c) => c.caseId === params.caseId);
    if (!targetCase || !claim) return;

    // Apply item decisions
    params.itemDecisions.forEach((dec) => {
      const item = claim.items.find((i) => i.itemId === dec.itemId);
      if (item) {
        item.clinicalDecision = dec.clinicalDecision;
        if (dec.modifiedCode) item.modifiedCode = dec.modifiedCode;
        if (dec.clinicalRationale) item.clinicalRationale = dec.clinicalRationale;

        // If modified or denied, recompute allowable
        if (dec.clinicalDecision === 'DENIED') {
          item.allowableAmount = 0;
          item.eligiblePayout = 0;
        } else if (dec.clinicalDecision === 'MODIFIED') {
          item.allowableAmount = Math.round(item.allowableAmount * 0.8);
          item.eligiblePayout = Math.max(0, item.allowableAmount - item.copay - item.coinsurance);
        }
      }
    });

    // Recompute financials
    const newAllowable = claim.items.reduce((acc, i) => acc + i.allowableAmount, 0);
    const newCopay = claim.items.reduce((acc, i) => (i.allowableAmount > 0 ? acc + i.copay : acc), 0);
    const newCoinsurance = claim.items.reduce((acc, i) => (i.allowableAmount > 0 ? acc + i.coinsurance : acc), 0);
    const newNetPayout = Math.max(0, newAllowable - newCopay - newCoinsurance);

    targetCase.financials.allowableAmount = newAllowable;
    targetCase.financials.copayApplied = newCopay;
    targetCase.financials.coinsuranceApplied = newCoinsurance;
    targetCase.financials.patientResponsibility = newCopay + newCoinsurance;
    targetCase.financials.netPayout = newNetPayout;

    const reserve = params.customReserve !== undefined ? params.customReserve : newAllowable;
    targetCase.financials.preliminaryReserve = reserve;

    // Advance Stage 4 -> Stage 5 (Settlement & Disbursement)
    targetCase.currentStage = 5;
    targetCase.stageName = 'SETTLEMENT_DISBURSEMENT';
    targetCase.status = params.decision;
    targetCase.assignedWorkbasket = 'SETTLEMENT_FINANCE';

    // Complete Doctor Review task
    const docTask = this.tasks.find(
      (t) => t.caseId === params.caseId && t.taskType === 'DOCTOR_CLINICAL_REVIEW'
    );
    if (docTask) {
      docTask.status = 'COMPLETED';
      docTask.resolvedAt = new Date().toISOString();
      docTask.resolutionNotes = params.doctorNotes;
    }

    // Normal sequential flow: Stage 5 proceeds to closeout & disbursement screen without intermediate tasks

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'CLINICAL_REVIEW_SUBMITTED',
      `Clinical adjudication completed by ${USER_PERSONAS[this.currentRole].name}: ${params.decision}. Notes: ${params.doctorNotes}`,
      { decision: params.decision, itemsReviewed: params.itemDecisions.length }
    );

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'RESERVE_CALCULATED',
      `Preliminary loss reserve established at $${reserve.toFixed(2)}. Net allowable: $${newAllowable.toFixed(2)}.`,
      { reserve, allowable: newAllowable }
    );

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'STAGE_ADVANCED',
      `Case advanced to Stage 5 (Settlement & Disbursement).`,
      { fromStage: 4, toStage: 5 }
    );

    this.lastStageFeedback = {
      caseId: targetCase._id,
      caseNumber: targetCase.caseNumber,
      fromStage: 4,
      toStage: 5,
      stageName: 'Stage 5: Settlement & Disbursement',
      title: `Clinical Adjudication Finalized (${params.decision}) · Advanced to Stage 05`,
      summary: `Medical necessity review completed by ${USER_PERSONAS[this.currentRole].name}. Net allowable: $${newAllowable.toFixed(2)}. Preliminary loss reserve locked at $${reserve.toFixed(2)}. Settlement voucher payment task dispatched to Finance.`,
      actor: {
        name: USER_PERSONAS[this.currentRole].name,
        role: this.currentRole,
      },
      timestamp: new Date().toISOString(),
      details: {
        reserve,
        netPayout: newNetPayout,
        actionTaken: `Physician Decision: ${params.decision}`,
      },
    };

    this.persist();
  }

  /**
   * SETTLEMENT: Authorize final payment voucher and close case (Stage 6)
   */
  public settleAndCloseCase(params: {
    caseId: string;
    authorizedAmount: number;
    paymentMethod: string;
    voucherNotes?: string;
  }) {
    const targetCase = this.cases.find((c) => c._id === params.caseId);
    const policy = this.policies.find((p) => p.policyNumber === targetCase?.familyPolicyNumber);
    if (!targetCase) return;

    targetCase.financials.netPayout = params.authorizedAmount;

    // Advance Stage 5 -> 6 (Closed & Archived)
    targetCase.currentStage = 6;
    targetCase.stageName = 'CLOSED_ARCHIVED';
    targetCase.status = 'SETTLED';

    // Update policy accumulated financials
    if (policy) {
      policy.financials.outOfPocketMet += targetCase.financials.patientResponsibility;
    }

    // Complete settlement task
    const payTask = this.tasks.find(
      (t) => t.caseId === params.caseId && t.taskType === 'SETTLEMENT_PAYMENT'
    );
    if (payTask) {
      payTask.status = 'COMPLETED';
      payTask.resolvedAt = new Date().toISOString();
      payTask.resolutionNotes = `Voucher authorized for $${params.authorizedAmount.toFixed(2)} via ${params.paymentMethod}`;
    }

    const voucherId = `VOUCH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'SETTLEMENT_AUTHORIZED',
      `Settlement voucher ${voucherId} approved for $${params.authorizedAmount.toFixed(2)} via ${params.paymentMethod} by ${USER_PERSONAS[this.currentRole].name}.`,
      { voucherId, amount: params.authorizedAmount, paymentMethod: params.paymentMethod }
    );

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'CASE_CLOSED',
      `Case ${targetCase.caseNumber} closed and permanently archived with full event audit stream preserved.`,
      { closedAt: new Date().toISOString() }
    );

    this.lastStageFeedback = {
      caseId: targetCase._id,
      caseNumber: targetCase.caseNumber,
      fromStage: 5,
      toStage: 6,
      stageName: 'Stage 6: Closed & Archived',
      title: 'Settlement Voucher Disbursed · Case Sealed (Stage 06)',
      summary: `Electronic payment voucher for $${params.authorizedAmount.toFixed(2)} disbursed via ${params.paymentMethod}. Case ${targetCase.caseNumber} has been sealed into the immutable BSON event store.`,
      actor: {
        name: USER_PERSONAS[this.currentRole].name,
        role: this.currentRole,
      },
      timestamp: new Date().toISOString(),
      details: {
        netPayout: params.authorizedAmount,
        actionTaken: `Voucher Disbursed: $${params.authorizedAmount.toFixed(2)}`,
      },
    };

    this.persist();
  }

  /**
   * INTAKE: Resolve duplicate exception hold
   */
  public resolveDuplicateHold(caseId: string, isDismissedAsDuplicate: boolean, notes: string) {
    const targetCase = this.cases.find((c) => c._id === caseId);
    if (!targetCase) return;

    const dupTask = this.tasks.find(
      (t) => t.caseId === caseId && t.taskType === 'DUPLICATE_CLAIM_CHECK'
    );
    if (dupTask) {
      dupTask.status = 'COMPLETED';
      dupTask.resolutionNotes = notes;
      dupTask.resolvedAt = new Date().toISOString();
    }

    if (isDismissedAsDuplicate) {
      targetCase.status = 'DENIED';
      targetCase.currentStage = 6;
      targetCase.stageName = 'CLOSED_ARCHIVED';
      this.appendEvent(
        targetCase._id,
        targetCase.caseNumber,
        'CASE_CLOSED',
        `Duplicate claim confirmed and rejected. Case closed by ${USER_PERSONAS[this.currentRole].name}.`,
        { action: 'REJECT_DUPLICATE', notes }
      );
    } else {
      // Clear duplicate hold and advance to evidence audit
      targetCase.status = 'PENDING_EVIDENCE';
      targetCase.currentStage = 3;
      targetCase.stageName = 'EVIDENCE_DCN_AUDIT';
      targetCase.assignedWorkbasket = 'EVIDENCE_DEFICIENCY';

      this.appendEvent(
        targetCase._id,
        targetCase.caseNumber,
        'STAGE_ADVANCED',
        `Duplicate exception cleared as legitimate resubmission. Advanced to Stage 3. Notes: ${notes}`,
        { action: 'CLEAR_DUPLICATE_OVERRIDE', notes }
      );

      this.lastStageFeedback = {
        caseId: targetCase._id,
        caseNumber: targetCase.caseNumber,
        fromStage: 2,
        toStage: 3,
        stageName: 'Stage 3: Evidence & DCN Audit',
        title: 'Duplicate Hold Cleared · Case Advanced to Stage 03',
        summary: `Collision exception cleared as legitimate resubmission. Case transitioned to Evidence Deficiencies workbasket for mandatory DCN verification.`,
        actor: {
          name: USER_PERSONAS[this.currentRole].name,
          role: this.currentRole,
        },
        timestamp: new Date().toISOString(),
        details: {
          actionTaken: 'Duplicate Override Approved',
        },
      };
    }

    this.persist();
  }

  /**
   * STAGE 2: Add / Remove Claim Service Line Items & Modify Patient Member
   */
  public updateClaimServicesAndMember(params: {
    caseId: string;
    patientMemberId?: string;
    patientHcid?: string;
    patientName?: string;
    items?: Array<{
      itemId?: string;
      code: string;
      description: string;
      billedAmount: number;
      category?: CareCategory;
      startDate?: string;
    }>;
  }): { success: boolean; message: string } {
    const targetCase = this.cases.find((c) => c._id === params.caseId);
    const claim = this.claims.find((c) => c.caseId === params.caseId);
    const policy = this.policies.find((p) => p.policyNumber === targetCase?.familyPolicyNumber);
    if (!targetCase || !claim || !policy) {
      return { success: false, message: 'Case, claim, or policy not found' };
    }

    if (params.patientMemberId) targetCase.patientMemberId = params.patientMemberId;
    if (params.patientHcid) targetCase.patientHcid = params.patientHcid;
    if (params.patientName) {
      targetCase.patientName = params.patientName;
      targetCase.title = `${targetCase.claimType === 'PRE_SERVICE' ? 'Pre-Service' : 'Post-Service'} ${targetCase.category} Claim - ${params.patientName}`;
    }

    if (params.items && params.items.length > 0) {
      const updatedItems = params.items.map((i, idx) => {
        const allowable = Math.min(i.billedAmount, Math.round(i.billedAmount * 0.75));
        const copay = policy.coverages.find((c) => c.category === targetCase.category)?.copay || 30;
        const coinsurance = Math.round((allowable - copay) * 0.2);
        const eligiblePayout = Math.max(0, allowable - copay - coinsurance);
        return {
          itemId: i.itemId || `ITM-${Date.now().toString().slice(-4)}-0${idx + 1}`,
          code: i.code,
          description: i.description,
          category: i.category || targetCase.category,
          startDate: i.startDate || claim.serviceDate,
          billedAmount: i.billedAmount,
          allowableAmount: allowable,
          copay,
          coinsurance,
          eligiblePayout,
          clinicalDecision: 'PENDING' as const,
        };
      });

      claim.items = updatedItems;
      const totalBilled = updatedItems.reduce((acc, i) => acc + i.billedAmount, 0);
      const totalAllowable = updatedItems.reduce((acc, i) => acc + i.allowableAmount, 0);
      const totalCopay = updatedItems.reduce((acc, i) => acc + i.copay, 0);
      const totalCoinsurance = updatedItems.reduce((acc, i) => acc + i.coinsurance, 0);
      const netPayout = Math.max(0, totalAllowable - totalCopay - totalCoinsurance);

      claim.totalBilledAmount = totalBilled;
      targetCase.financials.totalBilled = totalBilled;
      targetCase.financials.preliminaryReserve = totalAllowable;
      targetCase.financials.allowableAmount = totalAllowable;
      targetCase.financials.copayApplied = totalCopay;
      targetCase.financials.coinsuranceApplied = totalCoinsurance;
      targetCase.financials.patientResponsibility = totalCopay + totalCoinsurance;
      targetCase.financials.netPayout = netPayout;
    }

    targetCase.updatedAt = new Date().toISOString();

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'CLAIM_SERVICES_MODIFIED',
      `Claim services and patient member updated by ${USER_PERSONAS[this.currentRole].name}. ${params.items ? `${params.items.length} service line(s) active ($${targetCase.financials.totalBilled.toFixed(2)}).` : ''}`,
      {
        patientName: targetCase.patientName,
        patientHcid: targetCase.patientHcid,
        totalBilled: targetCase.financials.totalBilled,
      }
    );

    this.persist();
    return { success: true, message: 'Services and patient member updated successfully.' };
  }

  /**
   * STAGE 2: Confirm Initial Review and advance to Stage 3 Claim & Auth Evidence
   */
  public confirmInitialReview(
    caseId: string,
    notes?: string,
    updatedData?: {
      patientMemberId?: string;
      patientHcid?: string;
      patientName?: string;
      items?: Array<{
        code: string;
        description: string;
        billedAmount: number;
        category?: CareCategory;
      }>;
    }
  ) {
    const targetCase = this.cases.find((c) => c._id === caseId);
    if (!targetCase) return;

    if (updatedData) {
      this.updateClaimServicesAndMember({
        caseId,
        patientMemberId: updatedData.patientMemberId,
        patientHcid: updatedData.patientHcid,
        patientName: updatedData.patientName,
        items: updatedData.items,
      });
    }

    // Complete Initial Review task if any
    const reviewTask = this.tasks.find(
      (t) =>
        t.caseId === caseId &&
        (t.taskType === 'FAMILY_ELIGIBILITY_CHECK' || t.title.toLowerCase().includes('initial review')) &&
        t.status !== 'COMPLETED'
    );
    if (reviewTask) {
      reviewTask.status = 'COMPLETED';
      reviewTask.resolvedAt = new Date().toISOString();
      reviewTask.resolutionNotes = notes || 'Initial review confirmed via Open Review Screen.';
    }

    // Advance Stage 2 -> Stage 3 (Claim & Auth Evidence)
    targetCase.currentStage = 3;
    targetCase.stageName = 'CLAIM_AUTH_EVIDENCE';
    targetCase.status = 'PENDING_EVIDENCE';
    targetCase.assignedWorkbasket = 'EVIDENCE_DEFICIENCY';

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'STAGE_ADVANCED',
      `Stage 02 Initial Review confirmed by ${USER_PERSONAS[this.currentRole].name}. Case advanced to Stage 03 (Claim & Auth Evidence).`,
      { fromStage: 2, toStage: 3, notes }
    );

    this.lastStageFeedback = {
      caseId: targetCase._id,
      caseNumber: targetCase.caseNumber,
      fromStage: 2,
      toStage: 3,
      stageName: 'Stage 03: Claim & Auth Evidence',
      title: 'Initial Review Confirmed · Advanced to Stage 03',
      summary: `Request details, subscriber HCID, and provider credentials verified. Case advanced to Stage 03 Claim & Auth Evidence.`,
      actor: {
        name: USER_PERSONAS[this.currentRole].name,
        role: this.currentRole,
      },
      timestamp: new Date().toISOString(),
      details: {
        actionTaken: 'Initial Review Confirmed',
      },
    };

    this.persist();
  }

  /**
   * STAGE 3 -> 4: Advance Case to Stage 4 (Decision Stage) and spawn Doctor Clinical Review Task
   * Requirement: Only in decision stage should a task be created; case cannot advance to closeout without doctor review
   */
  public advanceToDecisionStage(caseId: string, notes?: string) {
    const targetCase = this.cases.find((c) => c._id === caseId);
    if (!targetCase) return;

    targetCase.currentStage = 4;
    targetCase.stageName = 'CLINICAL_FRAUD_ADJUDICATION';
    targetCase.status = 'PENDING_CLINICAL';
    targetCase.assignedWorkbasket = 'CLINICAL_REVIEW';
    targetCase.assignedDoctorId = 'DOC-DR-CHEN';

    // Spawn Doctor Review Task strictly at Decision Stage
    const hasDocTask = this.tasks.some(
      (t) => t.caseId === targetCase._id && t.taskType === 'DOCTOR_CLINICAL_REVIEW'
    );
    if (!hasDocTask) {
      const docTask: CaseTask = {
        _id: `task-${Date.now()}-doc`,
        taskId: `TSK-${Math.floor(10000 + Math.random() * 90000)}`,
        caseId: targetCase._id,
        caseNumber: targetCase.caseNumber,
        stageNumber: 4,
        workbasket: 'CLINICAL_REVIEW',
        taskType: 'DOCTOR_CLINICAL_REVIEW',
        title: `Doctor Clinical Necessity Decision: ${targetCase.claimId}`,
        priority: targetCase.priority,
        status: 'OPEN',
        assignedTo: {
          userId: 'usr_dr_chen',
          name: 'Dr. Sarah Chen, MD',
          role: 'DOCTOR_APPROVER',
        },
        slaHoursRemaining: 36,
        createdAt: new Date().toISOString(),
      };
      this.tasks.unshift(docTask);
    }

    const activeDocTask = this.tasks.find(
      (t) => t.caseId === targetCase._id && t.taskType === 'DOCTOR_CLINICAL_REVIEW'
    );

    this.appendEvent(
      targetCase._id,
      targetCase.caseNumber,
      'STAGE_ADVANCED',
      `Case advanced to Stage 04 (Decision Stage). Clinical decision task spawned for Dr. Sarah Chen, MD.`,
      { fromStage: 3, toStage: 4, taskId: activeDocTask?.taskId }
    );

    this.lastStageFeedback = {
      caseId: targetCase._id,
      caseNumber: targetCase.caseNumber,
      fromStage: 3,
      toStage: 4,
      stageName: 'Stage 04: Decision Stage',
      title: 'Advanced to Stage 04 Decision Stage · Doctor Task Created',
      summary: `Case routed to Clinical Decision. Formal adjudication task (${activeDocTask?.taskId}) has been dispatched for Dr. Sarah Chen, MD.`,
      actor: {
        name: USER_PERSONAS[this.currentRole].name,
        role: this.currentRole,
      },
      timestamp: new Date().toISOString(),
      details: {
        newTaskId: activeDocTask?.taskId,
        newTaskTitle: activeDocTask?.title,
        actionTaken: 'Advanced to Decision Stage',
      },
    };

    this.persist();
  }

  // --- MongoDB BSON Explorer & Mongoose Schemas ---
  public getMongoCollections() {
    return [
      { name: 'customers', count: this.customers.length, data: this.customers },
      { name: 'policies', count: this.policies.length, data: this.policies },
      { name: 'doctor_profiles', count: this.doctors.length, data: this.doctors },
      { name: 'cases', count: this.cases.length, data: this.cases },
      { name: 'claims', count: this.claims.length, data: this.claims },
      { name: 'case_tasks', count: this.tasks.length, data: this.tasks },
      { name: 'case_evidences', count: this.evidences.length, data: this.evidences },
      { name: 'fraud_assessments', count: this.fraudAssessments.length, data: this.fraudAssessments },
      { name: 'case_events', count: this.events.length, data: this.events },
    ];
  }

  public getMongooseSchemasCode(): string {
    return `// ==========================================
// OmniClaim Health - Mongoose Production Schemas
// Generated: ${new Date().toISOString()}
// ==========================================

import mongoose, { Schema, Document } from 'mongoose';

// 1. Cases Collection (Root Aggregate)
export const CaseSchema = new Schema({
  caseNumber: { type: String, required: true, unique: true, index: true },
  claimId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  currentStage: { type: Number, required: true, min: 1, max: 6, index: true },
  stageName: { type: String, required: true },
  status: { type: String, required: true, index: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  claimType: { type: String, enum: ['PRE_SERVICE', 'POST_SERVICE'], required: true },
  category: { type: String, enum: ['MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'], required: true },
  familyPolicyNumber: { type: String, required: true, index: true },
  patientMemberId: { type: String, required: true },
  patientName: { type: String, required: true },
  assignedWorkbasket: { type: String, required: true, index: true },
  assignedDoctorId: { type: String },
  financials: {
    totalBilled: { type: Number, default: 0 },
    preliminaryReserve: { type: Number, default: 0 },
    allowableAmount: { type: Number, default: 0 },
    deductibleApplied: { type: Number, default: 0 },
    copayApplied: { type: Number, default: 0 },
    coinsuranceApplied: { type: Number, default: 0 },
    patientResponsibility: { type: Number, default: 0 },
    netPayout: { type: Number, default: 0 }
  },
  missingDocumentTypes: [{ type: String }],
  tags: [{ type: String }]
}, { timestamps: true });

// 2. Case Tasks Collection (Workbaskets)
export const CaseTaskSchema = new Schema({
  taskId: { type: String, required: true, unique: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  caseNumber: { type: String, required: true },
  stageNumber: { type: Number, required: true },
  workbasket: { type: String, required: true, index: true },
  taskType: { type: String, required: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'COMPLETED', 'ESCALATED'], default: 'OPEN', index: true },
  assignedTo: {
    userId: String,
    name: String,
    role: String
  },
  requiredDocType: String,
  slaHoursRemaining: { type: Number, default: 24 },
  resolutionNotes: String,
  resolvedAt: Date
}, { timestamps: true });

// 3. Case Evidences (Legal DCN Master)
export const CaseEvidenceSchema = new Schema({
  dcnId: { type: String, required: true, unique: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  caseNumber: { type: String, required: true },
  documentType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: String },
  sourceChannel: { type: String, enum: ['PORTAL_UPLOAD', 'EDI_837', 'SECURE_FAX', 'OCR_INTAKE'], default: 'PORTAL_UPLOAD' },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED', 'DEFICIENT'], default: 'PENDING', index: true },
  verifiedBy: String,
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

// 4. Case Events Collection (Append-Only Event Store)
export const CaseEventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  caseNumber: { type: String, required: true },
  sequence: { type: Number, required: true },
  eventType: { type: String, required: true, index: true },
  actor: {
    role: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true }
  },
  summary: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true }
});
CaseEventSchema.index({ caseId: 1, sequence: 1 }, { unique: true });

export const CaseModel = mongoose.model('Case', CaseSchema);
export const CaseTaskModel = mongoose.model('CaseTask', CaseTaskSchema);
export const CaseEvidenceModel = mongoose.model('CaseEvidence', CaseEvidenceSchema);
export const CaseEventModel = mongoose.model('CaseEvent', CaseEventSchema);
`;
  }
}

export const claimsEngine = new ClaimsEngine();

export function useClaimsStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = claimsEngine.subscribe(() => setTick((t) => t + 1));
    return () => { unsub(); };
  }, []);

  return {
    engine: claimsEngine,
    currentRole: claimsEngine.getCurrentRole(),
    userPersona: claimsEngine.getCurrentUserPersona(),
    setRole: (role: UserRole) => claimsEngine.setRole(role),
    customers: claimsEngine.getCustomers(),
    policies: claimsEngine.getPolicies(),
    doctors: claimsEngine.getDoctors(),
    cases: claimsEngine.getCases(),
    claims: claimsEngine.getClaims(),
    evidences: claimsEngine.getEvidences(),
    tasks: claimsEngine.getAllTasks(),
    events: claimsEngine.getAllEvents(),
    submitClaimCase: claimsEngine.submitClaimCase.bind(claimsEngine),
    uploadEvidence: claimsEngine.uploadEvidence.bind(claimsEngine),
    verifyEvidence: claimsEngine.verifyEvidence.bind(claimsEngine),
    updateTaskStatus: claimsEngine.updateTaskStatus.bind(claimsEngine),
    doctorAdjudicateClaim: claimsEngine.doctorAdjudicateClaim.bind(claimsEngine),
    settleAndCloseCase: claimsEngine.settleAndCloseCase.bind(claimsEngine),
    resolveDuplicateHold: claimsEngine.resolveDuplicateHold.bind(claimsEngine),
    getCaseById: claimsEngine.getCaseById.bind(claimsEngine),
    getClaimForCase: claimsEngine.getClaimForCase.bind(claimsEngine),
    getTasksForCase: claimsEngine.getTasksForCase.bind(claimsEngine),
    getEvidencesForCase: claimsEngine.getEvidencesForCase.bind(claimsEngine),
    getFraudAssessmentForCase: claimsEngine.getFraudAssessmentForCase.bind(claimsEngine),
    getEventsForCase: claimsEngine.getEventsForCase.bind(claimsEngine),
    getMongoCollections: claimsEngine.getMongoCollections.bind(claimsEngine),
    getMongooseSchemasCode: claimsEngine.getMongooseSchemasCode.bind(claimsEngine),
    resetToSeeds: claimsEngine.resetToSeeds.bind(claimsEngine),
    lastStageFeedback: claimsEngine.getLastStageFeedback(),
    clearStageFeedback: claimsEngine.clearStageFeedback.bind(claimsEngine),
    triggerStageFeedback: claimsEngine.triggerStageFeedback.bind(claimsEngine),
    searchMembersByHcid: claimsEngine.searchMembersByHcid.bind(claimsEngine),
    confirmInitialReview: claimsEngine.confirmInitialReview.bind(claimsEngine),
    updateClaimServicesAndMember: claimsEngine.updateClaimServicesAndMember.bind(claimsEngine),
    advanceToDecisionStage: claimsEngine.advanceToDecisionStage.bind(claimsEngine),
  };
}
