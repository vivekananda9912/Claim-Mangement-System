/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IFamilyMember {
  memberId: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNDISCLOSED';
  relationship: 'PRIMARY' | 'SPOUSE' | 'CHILD' | 'DEPENDENT';
  ssnLast4?: string;
}

export interface ICustomer extends Document {
  familyPolicyNumber: string;
  primarySubscriber: IFamilyMember;
  dependents: IFamilyMember[];
  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  status: 'ACTIVE' | 'TERMINATED' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>({
  memberId: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'UNDISCLOSED'], default: 'UNDISCLOSED' },
  relationship: { type: String, enum: ['PRIMARY', 'SPOUSE', 'CHILD', 'DEPENDENT'], required: true },
  ssnLast4: { type: String },
}, { _id: false });

export const CustomerSchema = new Schema<ICustomer>({
  familyPolicyNumber: { type: String, required: true, unique: true, index: true },
  primarySubscriber: { type: FamilyMemberSchema, required: true },
  dependents: [FamilyMemberSchema],
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
  },
  status: { type: String, enum: ['ACTIVE', 'TERMINATED', 'PENDING'], default: 'ACTIVE', index: true },
}, { timestamps: true });

CustomerSchema.index({ 'primarySubscriber.memberId': 1 }, { unique: true });
CustomerSchema.index({ 'dependents.memberId': 1 });

export const CustomerModel = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
