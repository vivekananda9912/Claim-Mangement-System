/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import { EvidenceModel, IEvidence, DocumentType, VerificationStatus } from './evidence.model';
import { eventService } from '../event/event.service';
import { ICaseActor } from '../event/event.model';

export class EvidenceService {
  /**
   * Mints an enterprise Document Control Number (DCN) and registers evidence
   */
  public async mintEvidence(params: {
    caseId: string;
    claimId: string;
    documentType: DocumentType;
    fileName: string;
    fileSizeBytes: number;
    mimeType?: string;
    contentBufferOrString?: string;
    actor: ICaseActor;
  }): Promise<IEvidence> {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dcn = `DCN-${today}-${randomSuffix}`;

    const checksum = params.contentBufferOrString
      ? crypto.createHash('sha256').update(params.contentBufferOrString).digest('hex')
      : crypto.createHash('sha256').update(`${dcn}-${params.fileName}-${Date.now()}`).digest('hex');

    const storagePath = `secure-vault/cases/${params.caseId}/dcn/${dcn}-${params.fileName}`;

    const evidence = new EvidenceModel({
      dcn,
      caseId: params.caseId,
      claimId: params.claimId,
      documentType: params.documentType,
      fileName: params.fileName,
      fileSizeBytes: params.fileSizeBytes,
      sha256Checksum: checksum,
      mimeType: params.mimeType || 'application/pdf',
      storagePath,
      isLegible: true,
      verificationStatus: 'PENDING_AUDIT',
    });

    const saved = await evidence.save();

    await eventService.appendEvent(
      params.caseId,
      'DCN_MINTED',
      3, // Stage 3 Evidence & DCN Audit
      params.actor,
      { dcn, documentType: params.documentType, fileName: params.fileName, checksum }
    );

    return saved;
  }

  /**
   * Operations Analyst or System Admin audits and verifies/rejects evidence document
   */
  public async verifyEvidence(
    dcn: string,
    verificationStatus: VerificationStatus,
    isLegible: boolean,
    rejectionReason: string | undefined,
    actor: ICaseActor
  ): Promise<IEvidence | null> {
    const evidence = await EvidenceModel.findOne({ dcn }).exec();
    if (!evidence) return null;

    evidence.verificationStatus = verificationStatus;
    evidence.isLegible = isLegible;
    evidence.rejectionReason = rejectionReason;
    evidence.verifiedAt = new Date();
    evidence.verifiedBy = actor.fullName;

    const saved = await evidence.save();

    await eventService.appendEvent(
      evidence.caseId,
      verificationStatus === 'VERIFIED' ? 'EVIDENCE_VERIFIED' : 'EVIDENCE_REJECTED',
      3,
      actor,
      { dcn, verificationStatus, isLegible, rejectionReason }
    );

    return saved;
  }

  public async getByCaseId(caseId: string): Promise<IEvidence[]> {
    return await EvidenceModel.find({ caseId }).sort({ createdAt: -1 }).exec();
  }

  public async getByDcn(dcn: string): Promise<IEvidence | null> {
    return await EvidenceModel.findOne({ dcn }).exec();
  }
}

export const evidenceService = new EvidenceService();
