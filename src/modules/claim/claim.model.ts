/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';
import { CareCategory } from '../policy/policy.model';

export interface IClaimItem {
  itemId: string;
  procedureCode: string;
  description: string;
  category: CareCategory;
  serviceDate: Date;
  billedAmount: number;
  feeScheduleAllowable: number;
  copay: number;
  coinsurance: number;
  eligiblePayout: number;
  clinicalReviewStatus: 'PENDING_DOCTOR_REVIEW' | 'APPROVED' | 'MODIFIED_CODE' | 'DENIED';
  appliedCodeModifier?: string;
  clinicalRationale?: string;
  adjudicatedAmount: number;
}

export interface IClaim extends Document {
  claimId: string;
  caseId?: any;
  claimType: 'PRE_SERVICE' | 'POST_SERVICE';
  careCategory: CareCategory;
  provider: {
    npi: string;
    name: string;
    facilityType: 'INSTITUTIONAL' | 'PROFESSIONAL' | 'PHARMACY_RETAIL';
    taxId?: string;
    billingAddress?: string;
  };
  patient: {
    memberId: string;
    name: string;
    familyPolicyNumber: string;
  };
  serviceStartDate: Date;
  serviceEndDate?: Date;
  diagnoses: Array<{
    code: string;
    description: string;
    isPrimary: boolean;
  }>;
  items: IClaimItem[];
  totalBilledAmount: number;
  submissionChannel: 'WEB_PROVIDER_PORTAL' | 'EDI_837_ELECTRONIC' | 'MEMBER_DIRECT';
  createdAt: Date;
  updatedAt: Date;
}

const ClaimItemSchema = new Schema<IClaimItem>({
  itemId: { type: String, required: true },
  procedureCode: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'], required: true },
  serviceDate: { type: Date, required: true },
  billedAmount: { type: Number, required: true },
  feeScheduleAllowable: { type: Number, required: true, default: 0 },
  copay: { type: Number, default: 0 },
  coinsurance: { type: Number, default: 0 },
  eligiblePayout: { type: Number, default: 0 },
  clinicalReviewStatus: {
    type: String,
    enum: ['PENDING_DOCTOR_REVIEW', 'APPROVED', 'MODIFIED_CODE', 'DENIED'],
    default: 'PENDING_DOCTOR_REVIEW',
  },
  appliedCodeModifier: { type: String },
  clinicalRationale: { type: String },
  adjudicatedAmount: { type: Number, default: 0 },
}, { _id: false });

export const ClaimSchema = new Schema<IClaim>({
  claimId: { type: String, required: true, unique: true, index: true },
  caseId: { type: Schema.Types.Mixed, ref: 'Case', required: false, index: true },
  claimType: { type: String, enum: ['PRE_SERVICE', 'POST_SERVICE'], required: true },
  careCategory: { type: String, enum: ['MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'], required: true },
  provider: {
    npi: { type: String, required: true, index: true },
    name: { type: String, required: true },
    facilityType: { type: String, enum: ['INSTITUTIONAL', 'PROFESSIONAL', 'PHARMACY_RETAIL'], default: 'INSTITUTIONAL' },
    taxId: { type: String },
    billingAddress: { type: String },
  },
  patient: {
    memberId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    familyPolicyNumber: { type: String, required: true, index: true },
  },
  serviceStartDate: { type: Date, required: true, index: true },
  serviceEndDate: { type: Date },
  diagnoses: [{
    code: { type: String, required: true },
    description: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  }],
  items: [ClaimItemSchema],
  totalBilledAmount: { type: Number, required: true, index: true },
  submissionChannel: {
    type: String,
    enum: ['WEB_PROVIDER_PORTAL', 'EDI_837_ELECTRONIC', 'MEMBER_DIRECT'],
    default: 'WEB_PROVIDER_PORTAL',
  },
}, { timestamps: true });

// Compound index for composite duplicate detection
ClaimSchema.index({
  'provider.npi': 1,
  'patient.memberId': 1,
  serviceStartDate: 1,
  totalBilledAmount: 1,
});

export const ClaimModel = mongoose.models.Claim || mongoose.model<IClaim>('Claim', ClaimSchema);
