/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorProfile extends Document {
  profileId: string;
  npi: string;
  fullName: string;
  specialties: string[];
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Date;
  clinicalPrivileges: string[];
  maxSettlementAuthority: number;
  associatedUserId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    profileId: { type: String, required: true, unique: true, index: true },
    npi: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    specialties: [{ type: String }],
    licenseNumber: { type: String, required: true },
    licenseState: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    clinicalPrivileges: [{ type: String }],
    maxSettlementAuthority: { type: Number, default: 25000 },
    associatedUserId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'doctor_profiles',
  }
);

export const DoctorProfileModel = mongoose.model<IDoctorProfile>('DoctorProfile', DoctorProfileSchema);
