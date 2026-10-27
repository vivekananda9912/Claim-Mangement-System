/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type CareLine = 'MEDICAL' | 'PHARMACY' | 'PRESCRIPTION' | 'BEHAVIORAL_HEALTH';
export type TimingType = 'PRE_SERVICE' | 'POST_SERVICE';
export type CaseStatus =
  | 'ACTIVE'
  | 'PENDING_INFO'
  | 'SUSPENDED_FRAUD'
  | 'APPROVED'
  | 'DENIED'
  | 'CLOSED';

export interface IFinancialSummary {
  totalBilled: number;
  totalApproved: number;
  preliminaryReserve: number;
  deductibleApplied: number;
  copayApplied: number;
  settlementAmount: number;
}

export interface ISettlementVoucher {
  voucherId: string;
  paymentMethod: 'EFT_DIRECT_DEPOSIT' | 'CHECK_DISBURSEMENT' | 'VIRTUAL_CARD';
  checkNumberOrEft: string;
  issuedAt: Date;
  disbursedBy: string;
}

export interface ICase extends Document {
  caseId: string;
  currentStage: number; // 1 to 6
  policyNumber: string;
  memberId: string;
  careLine: CareLine;
  timingType: TimingType;
  claimId?: string;
  status: CaseStatus;
  financialSummary: IFinancialSummary;
  isDuplicate: boolean;
  isDeficient: boolean;
  isFraudFlagged: boolean;
  settlementVoucher?: ISettlementVoucher;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialSummarySchema = new Schema<IFinancialSummary>(
  {
    totalBilled: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    preliminaryReserve: { type: Number, default: 0 },
    deductibleApplied: { type: Number, default: 0 },
    copayApplied: { type: Number, default: 0 },
    settlementAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const SettlementVoucherSchema = new Schema<ISettlementVoucher>(
  {
    voucherId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['EFT_DIRECT_DEPOSIT', 'CHECK_DISBURSEMENT', 'VIRTUAL_CARD'],
      required: true,
    },
    checkNumberOrEft: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    disbursedBy: { type: String, required: true },
  },
  { _id: false }
);

const CaseSchema = new Schema<ICase>(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    currentStage: { type: Number, required: true, min: 1, max: 6, default: 1, index: true },
    policyNumber: { type: String, required: true, index: true },
    memberId: { type: String, required: true, index: true },
    careLine: {
      type: String,
      enum: ['MEDICAL', 'PHARMACY', 'PRESCRIPTION', 'BEHAVIORAL_HEALTH'],
      required: true,
      index: true,
    },
    timingType: {
      type: String,
      enum: ['PRE_SERVICE', 'POST_SERVICE'],
      required: true,
    },
    claimId: { type: String, index: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING_INFO', 'SUSPENDED_FRAUD', 'APPROVED', 'DENIED', 'CLOSED'],
      default: 'ACTIVE',
      index: true,
    },
    financialSummary: { type: FinancialSummarySchema, default: () => ({}) },
    isDuplicate: { type: Boolean, default: false, index: true },
    isDeficient: { type: Boolean, default: false, index: true },
    isFraudFlagged: { type: Boolean, default: false, index: true },
    settlementVoucher: { type: SettlementVoucherSchema },
  },
  {
    timestamps: true,
    collection: 'cases',
  }
);

CaseSchema.index({ currentStage: 1, status: 1 });

export const CaseModel = mongoose.model<ICase>('Case', CaseSchema);
