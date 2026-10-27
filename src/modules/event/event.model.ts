/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type CaseEventType =
  | 'CASE_CREATED'
  | 'STAGE_TRANSITIONED'
  | 'POLICY_VERIFIED'
  | 'POLICY_REJECTED'
  | 'CLAIM_INTAKEN'
  | 'DUPLICATE_CHECK_PASSED'
  | 'DUPLICATE_CHECK_FLAGGED'
  | 'DEFICIENCY_RAISED'
  | 'DCN_MINTED'
  | 'EVIDENCE_VERIFIED'
  | 'EVIDENCE_REJECTED'
  | 'DEFICIENCY_CLEARED'
  | 'TASK_SPAWNED'
  | 'TASK_ASSIGNED'
  | 'TASK_COMPLETED'
  | 'CLINICAL_REVIEW_STARTED'
  | 'CLINICAL_ADJUDICATED'
  | 'PROCEDURE_RECLASSIFIED'
  | 'FRAUD_SCORED'
  | 'FRAUD_CLEARED'
  | 'SETTLEMENT_CALCULATED'
  | 'SETTLEMENT_DISBURSED'
  | 'CASE_CLOSED'
  | 'CASE_REOPENED';

export interface ICaseActor {
  userId: string;
  fullName: string;
  role: string;
  ipAddress?: string;
}

export interface ICaseEvent extends Document {
  caseId: string;
  sequenceNumber: number;
  eventType: CaseEventType;
  stageNumber: number;
  actor: ICaseActor;
  payload: Record<string, any>;
  correlationId?: string;
  createdAt: Date;
}

const CaseActorSchema = new Schema<ICaseActor>(
  {
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { _id: false }
);

const CaseEventSchema = new Schema<ICaseEvent>(
  {
    caseId: { type: String, required: true, index: true },
    sequenceNumber: { type: Number, required: true },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    stageNumber: { type: Number, required: true },
    actor: { type: CaseActorSchema, required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    correlationId: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // strictly immutable
    collection: 'case_events',
  }
);

// Compound index for strict sequential ordering per case
CaseEventSchema.index({ caseId: 1, sequenceNumber: 1 }, { unique: true });
CaseEventSchema.index({ eventType: 1, createdAt: -1 });

export const CaseEventModel = mongoose.model<ICaseEvent>('CaseEvent', CaseEventSchema);
