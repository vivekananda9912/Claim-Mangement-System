/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type CareCategory = 'MEDICAL' | 'PHARMACY' | 'PRESCRIPTION' | 'BEHAVIORAL_HEALTH';

export interface ICategoryCoverage {
  category: CareCategory;
  copay: number;
  coinsurancePercentage: number;
  maxLifetimeBenefit: number;
  requiresPreAuth: boolean;
}

export interface IPolicy extends Document {
  policyNumber: string;
  planCode: string;
  planName: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  effectiveDate: Date;
  expirationDate: Date;
  networkTier: 'IN_NETWORK' | 'OUT_OF_NETWORK' | 'TIER_1_PREFERRED' | 'TIER_2_STANDARD';
  familyFinancials: {
    annualDeductible: number;
    deductibleMetToDate: number;
    outOfPocketMax: number;
    outOfPocketMetToDate: number;
  };
  categoryCoverages: ICategoryCoverage[];
  exclusions: string[];
  preAuthRequiredProcedures: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CategoryCoverageSchema = new Schema<ICategoryCoverage>({
  category: { type: String, enum: ['MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'], required: true },
  copay: { type: Number, required: true, default: 0 },
  coinsurancePercentage: { type: Number, required: true, default: 20 },
  maxLifetimeBenefit: { type: Number, required: true, default: 1000000 },
  requiresPreAuth: { type: Boolean, default: false },
}, { _id: false });

export const PolicySchema = new Schema<IPolicy>({
  policyNumber: { type: String, required: true, unique: true, index: true },
  planCode: { type: String, required: true, index: true },
  planName: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE', index: true },
  effectiveDate: { type: Date, required: true, index: true },
  expirationDate: { type: Date, required: true, index: true },
  networkTier: { type: String, enum: ['IN_NETWORK', 'OUT_OF_NETWORK', 'TIER_1_PREFERRED', 'TIER_2_STANDARD'], default: 'IN_NETWORK' },
  familyFinancials: {
    annualDeductible: { type: Number, required: true, default: 3000 },
    deductibleMetToDate: { type: Number, required: true, default: 0 },
    outOfPocketMax: { type: Number, required: true, default: 8000 },
    outOfPocketMetToDate: { type: Number, required: true, default: 0 },
  },
  categoryCoverages: [CategoryCoverageSchema],
  exclusions: [{ type: String }],
  preAuthRequiredProcedures: [{ type: String }],
}, { timestamps: true });

PolicySchema.index({ status: 1, effectiveDate: 1, expirationDate: 1 });

export const PolicyModel = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);
