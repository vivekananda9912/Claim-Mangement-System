/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type DocumentType =
  | 'UB04_CMS1450'
  | 'HCFA1500'
  | 'OPERATIVE_REPORT'
  | 'PHARMACY_RECEIPT'
  | 'PRESCRIPTION_SCRIPT'
  | 'BEHAVIORAL_ASSESSMENT'
  | 'ITEMIZED_BILL';

export type VerificationStatus = 'PENDING_AUDIT' | 'VERIFIED' | 'REJECTED';

export interface IEvidence extends Document {
  dcn: string;
  caseId: string;
  claimId: string;
  documentType: DocumentType;
  fileName: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  mimeType: string;
  storagePath: string;
  isLegible: boolean;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceSchema = new Schema<IEvidence>(
  {
    dcn: { type: String, required: true, unique: true, index: true },
    caseId: { type: String, required: true, index: true },
    claimId: { type: String, required: true, index: true },
    documentType: {
      type: String,
      required: true,
      enum: [
        'UB04_CMS1450',
        'HCFA1500',
        'OPERATIVE_REPORT',
        'PHARMACY_RECEIPT',
        'PRESCRIPTION_SCRIPT',
        'BEHAVIORAL_ASSESSMENT',
        'ITEMIZED_BILL',
      ],
    },
    fileName: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    sha256Checksum: { type: String, required: true },
    mimeType: { type: String, default: 'application/pdf' },
    storagePath: { type: String, required: true },
    isLegible: { type: Boolean, default: true },
    verificationStatus: {
      type: String,
      enum: ['PENDING_AUDIT', 'VERIFIED', 'REJECTED'],
      default: 'PENDING_AUDIT',
      index: true,
    },
    rejectionReason: { type: String },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'evidences',
  }
);

EvidenceSchema.index({ caseId: 1, verificationStatus: 1 });

export const EvidenceModel = mongoose.model<IEvidence>('Evidence', EvidenceSchema);
