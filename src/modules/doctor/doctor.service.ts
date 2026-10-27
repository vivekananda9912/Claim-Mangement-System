/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DoctorProfileModel, IDoctorProfile } from './doctor.model';
import { ClaimModel } from '../claim/claim.model';
import { eventService } from '../event/event.service';
import { ICaseActor } from '../event/event.model';

export interface IClinicalLineDecision {
  itemId: string;
  adjudicationStatus: 'APPROVED' | 'MODIFIED_CODE' | 'DENIED';
  reclassifiedProcedureCode?: string;
  reclassifiedReason?: string;
  approvedAmount: number;
}

export class DoctorService {
  public async getDoctorProfile(profileId: string): Promise<IDoctorProfile | null> {
    return await DoctorProfileModel.findOne({ profileId }).exec();
  }

  public async getDoctorByNpi(npi: string): Promise<IDoctorProfile | null> {
    return await DoctorProfileModel.findOne({ npi }).exec();
  }

  public async listDoctors(): Promise<IDoctorProfile[]> {
    return await DoctorProfileModel.find({ isActive: true }).exec();
  }

  /**
   * Performs physician clinical adjudication on claim lines (including CPT/Rx down-coding)
   */
  public async submitClinicalReview(params: {
    caseId: string;
    claimId: string;
    doctorProfileId: string;
    decisions: IClinicalLineDecision[];
    clinicalRationale: string;
    preliminaryReserveLock: number;
    actor: ICaseActor;
  }) {
    const doctor = await DoctorProfileModel.findOne({ profileId: params.doctorProfileId }).exec();
    if (!doctor) throw new Error(`Doctor profile not found: ${params.doctorProfileId}`);

    if (new Date(doctor.licenseExpiry) < new Date()) {
      throw new Error(`Doctor license expired on ${doctor.licenseExpiry.toISOString().slice(0, 10)}`);
    }

    const claim = await ClaimModel.findOne({ claimId: params.claimId }).exec();
    if (!claim) throw new Error(`Claim not found: ${params.claimId}`);

    let totalApproved = 0;
    const reclassifications: any[] = [];

    for (const dec of params.decisions) {
      const item = claim.items.find((i: any) => i.itemId === dec.itemId);
      if (item) {
        if (dec.reclassifiedProcedureCode && dec.reclassifiedProcedureCode !== item.procedureCode) {
          reclassifications.push({
            itemId: item.itemId,
            originalCode: item.procedureCode,
            newCode: dec.reclassifiedProcedureCode,
            originalBilled: item.billedAmount,
            adjustedAmount: dec.approvedAmount,
            reason: dec.reclassifiedReason,
          });
          item.procedureCode = dec.reclassifiedProcedureCode;
        }

        item.clinicalReviewStatus = dec.adjudicationStatus;
        item.adjudicatedAmount = dec.approvedAmount;
        if (dec.reclassifiedReason) item.clinicalRationale = dec.reclassifiedReason;
        totalApproved += dec.approvedAmount;
      }
    }

    if (totalApproved > doctor.maxSettlementAuthority) {
      throw new Error(
        `Total approved amount ($${totalApproved.toLocaleString()}) exceeds Doctor's signing authority ($${doctor.maxSettlementAuthority.toLocaleString()})`
      );
    }

    await claim.save();

    // Log procedure reclassification event if any
    if (reclassifications.length > 0) {
      await eventService.appendEvent(
        params.caseId,
        'PROCEDURE_RECLASSIFIED',
        4, // Stage 4 Clinical & Fraud Adjudication
        params.actor,
        {
          doctorProfileId: doctor.profileId,
          doctorName: doctor.fullName,
          reclassifications,
        }
      );
    }

    // Log clinical adjudication event
    await eventService.appendEvent(
      params.caseId,
      'CLINICAL_ADJUDICATED',
      4,
      params.actor,
      {
        doctorProfileId: doctor.profileId,
        doctorName: doctor.fullName,
        doctorNpi: doctor.npi,
        totalApproved,
        preliminaryReserveLock: params.preliminaryReserveLock,
        clinicalRationale: params.clinicalRationale,
      }
    );

    return {
      success: true,
      claimId: claim.claimId,
      doctor: doctor.fullName,
      totalApproved,
      preliminaryReserve: params.preliminaryReserveLock,
      reclassificationsCount: reclassifications.length,
    };
  }

  public async seedDefaultDoctor(profile: Partial<IDoctorProfile>): Promise<IDoctorProfile> {
    const existing = await DoctorProfileModel.findOne({ profileId: profile.profileId }).exec();
    if (existing) return existing;
    const doc = new DoctorProfileModel({
      profileId: profile.profileId,
      npi: profile.npi,
      fullName: profile.fullName,
      specialties: profile.specialties || ['Internal Medicine'],
      licenseNumber: profile.licenseNumber || 'MD-CA-99212',
      licenseState: profile.licenseState || 'CA',
      licenseExpiry: profile.licenseExpiry || new Date(Date.now() + 365 * 24 * 3600 * 1000),
      clinicalPrivileges: profile.clinicalPrivileges || ['INPATIENT_REVIEW', 'SURGICAL_AUDIT', 'RX_FORMULARY'],
      maxSettlementAuthority: profile.maxSettlementAuthority || 50000,
      isActive: true,
    });
    return await doc.save();
  }
}

export const doctorService = new DoctorService();
