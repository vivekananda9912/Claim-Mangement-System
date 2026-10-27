/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export type UserRole =
  | 'BUSINESS_REQUESTER'
  | 'PROCESS_OWNER'
  | 'DOCTOR_APPROVER'
  | 'OPERATIONS_ANALYST'
  | 'SYSTEM_ADMIN';

export type WorkbasketQueue =
  | 'INTAKE'
  | 'EVIDENCE_DEFICIENCY'
  | 'CLINICAL_REVIEW'
  | 'FRAUD_SIU'
  | 'SETTLEMENT'
  | 'ALL_WORKBASKETS';

export interface IUser extends Document {
  userId: string;
  username: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  department: string;
  authorizedWorkbaskets: WorkbasketQueue[];
  doctorProfileId?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  role: {
    type: String,
    enum: ['BUSINESS_REQUESTER', 'PROCESS_OWNER', 'DOCTOR_APPROVER', 'OPERATIONS_ANALYST', 'SYSTEM_ADMIN'],
    required: true,
    index: true,
  },
  department: { type: String, required: true },
  authorizedWorkbaskets: [{
    type: String,
    enum: ['INTAKE', 'EVIDENCE_DEFICIENCY', 'CLINICAL_REVIEW', 'FRAUD_SIU', 'SETTLEMENT', 'ALL_WORKBASKETS'],
  }],
  doctorProfileId: { type: String },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'], default: 'ACTIVE', index: true },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
