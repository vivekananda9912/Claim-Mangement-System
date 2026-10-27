/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IFraudFlag {
  ruleId: string;
  ruleName: string;
  scoreContribution: number;
  description: string;
  evidenceData?: Record<string, any>;
}

export interface IFraudAssessment extends Document {
  assessmentId: string;
  caseId: string;
  claimId: string;
  riskScore: number;
  riskTier: RiskTier;
  flags: IFraudFlag[];
  isUnderInvestigation: boolean;
  investigatorNotes?: string;
  clearedAt?: Date;
  clearedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FraudFlagSchema = new Schema<IFraudFlag>(
  {
    ruleId: { type: String, required: true },
    ruleName: { type: String, required: true },
    scoreContribution: { type: Number, required: true },
    description: { type: String, required: true },
    evidenceData: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const FraudAssessmentSchema = new Schema<IFraudAssessment>(
  {
    assessmentId: { type: String, required: true, unique: true, index: true },
    caseId: { type: String, required: true, index: true },
    claimId: { type: String, required: true, index: true },
    riskScore: { type: Number, required: true, min: 0, max: 100, index: true },
    riskTier: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
      index: true,
    },
    flags: [FraudFlagSchema],
    isUnderInvestigation: { type: Boolean, default: false },
    investigatorNotes: { type: String },
    clearedAt: { type: Date },
    clearedBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'fraud_assessments',
  }
);

FraudAssessmentSchema.index({ caseId: 1, riskTier: 1 });

export const FraudAssessmentModel = mongoose.model<IFraudAssessment>(
  'FraudAssessment',
  FraudAssessmentSchema
);
