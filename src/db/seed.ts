/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { userService } from '../modules/user/user.service';
import { doctorService } from '../modules/doctor/doctor.service';
import { customerService } from '../modules/customer/customer.service';
import { policyService } from '../modules/policy/policy.service';
import { claimService } from '../modules/claim/claim.service';
import { connectDatabase } from './connection';

export async function seedDatabase() {
  await connectDatabase();

  console.log('[OmniClaim Seeder] Initializing enterprise master data...');

  // 1. Seed 5 Enterprise Personas with bcrypt credentials
  await userService.seedDefaultUsers();

  // 2. Seed Doctor Clinical Profile
  await doctorService.seedDefaultDoctor({
    profileId: 'DOC-PROF-9921',
    npi: '1982736450',
    fullName: 'Dr. Sarah Chen, MD, FACC',
    specialties: ['Interventional Cardiology', 'Internal Medicine'],
    licenseNumber: 'MD-CA-99212',
    licenseState: 'CA',
    licenseExpiry: new Date('2028-12-31'),
    clinicalPrivileges: [
      'INPATIENT_ADMISSION_REVIEW',
      'CARDIAC_CATH_AUDIT',
      'CPT_DOWNCODING',
      'RX_FORMULARY_SUBSTITUTION',
    ],
    maxSettlementAuthority: 50000,
    isActive: true,
  });

  // 3. Seed Family Customer Master Record
  const existingCust = await customerService.getByFamilyPolicyNumber('POL-HEALTH-2026-9812');
  if (!existingCust) {
    await customerService.createCustomer({
      familyPolicyNumber: 'POL-HEALTH-2026-9812',
      primarySubscriber: {
        memberId: 'MEM-9812-01',
        firstName: 'Eleanor',
        lastName: 'Vance',
        dob: new Date('1984-06-12'),
        relationship: 'PRIMARY',
        gender: 'FEMALE',
        ssnLast4: '4421',
      },
      dependents: [
        {
          memberId: 'MEM-9812-02',
          firstName: 'Arthur',
          lastName: 'Vance',
          dob: new Date('1982-11-20'),
          relationship: 'SPOUSE',
          gender: 'MALE',
          ssnLast4: '8832',
        },
        {
          memberId: 'MEM-9812-03',
          firstName: 'Chloe',
          lastName: 'Vance',
          dob: new Date('2014-04-15'),
          relationship: 'CHILD',
          gender: 'FEMALE',
          ssnLast4: '1099',
        },
      ],
      contact: {
        email: 'eleanor.vance@example.com',
        phone: '+1 (541) 555-0199',
        address: {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477',
        },
      },
      status: 'ACTIVE',
    } as any);
  }

  // 4. Seed Policy Master Record with family deductible & schedule
  const existingPolicy = await policyService.getByPolicyNumber('POL-HEALTH-2026-9812');
  if (!existingPolicy) {
    await policyService.createPolicy({
      policyNumber: 'POL-HEALTH-2026-9812',
      planCode: 'PPO-PLATINUM-SHIELD',
      planName: 'OmniCare Platinum Family Shield PPO',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_1_PREFERRED',
      familyFinancials: {
        annualDeductible: 3000,
        deductibleMetToDate: 1800, // Remaining = $1200
        outOfPocketMax: 8000,
        outOfPocketMetToDate: 1800,
      },
      categoryCoverages: [
        {
          category: 'MEDICAL',
          copay: 40,
          coinsurancePercentage: 20,
          maxLifetimeBenefit: 500000,
          requiresPreAuth: false,
        },
        {
          category: 'PHARMACY',
          copay: 20,
          coinsurancePercentage: 15,
          maxLifetimeBenefit: 250000,
          requiresPreAuth: false,
        },
        {
          category: 'PRESCRIPTION',
          copay: 15,
          coinsurancePercentage: 10,
          maxLifetimeBenefit: 200000,
          requiresPreAuth: false,
        },
        {
          category: 'BEHAVIORAL_HEALTH',
          copay: 25,
          coinsurancePercentage: 15,
          maxLifetimeBenefit: 300000,
          requiresPreAuth: false,
        },
      ],
      exclusions: ['COSMETIC_RHINOPLASTY', 'EXPERIMENTAL_GENE_THERAPY'],
      preAuthRequiredProcedures: ['CPT-99223', 'CPT-33533', 'CPT-70553'],
    } as any);
  }

  // 5. Seed Baseline Historical Claim (for testing duplicate detection)
  const existingClaim = await claimService.getByClaimId('CLM-HIST-2026-8801');
  if (!existingClaim) {
    await claimService.createClaim({
      claimId: 'CLM-HIST-2026-8801',
      claimType: 'POST_SERVICE',
      careCategory: 'MEDICAL',
      provider: {
        npi: '1982736450',
        name: 'St. Jude Metropolitan Hospital',
        facilityType: 'INSTITUTIONAL',
      },
      patient: {
        memberId: 'MEM-9812-01',
        name: 'Eleanor Vance',
        familyPolicyNumber: 'POL-HEALTH-2026-9812',
      },
      serviceStartDate: new Date('2026-02-10'),
      serviceEndDate: new Date('2026-02-12'),
      diagnoses: [
        { code: 'I21.0', description: 'Acute transmural myocardial infarction of anterior wall', isPrimary: true },
        { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery', isPrimary: false },
      ],
      totalBilledAmount: 4850,
      submissionChannel: 'EDI_837_ELECTRONIC',
      items: [
        {
          itemId: 'ITEM-HIST-01',
          procedureCode: 'CPT-99223',
          description: 'Initial hospital care, high complexity inpatient',
          category: 'MEDICAL',
          serviceDate: new Date('2026-02-10'),
          billedAmount: 3200,
          feeScheduleAllowable: 2720,
          copay: 40,
          coinsurance: 0,
          eligiblePayout: 2720,
          clinicalReviewStatus: 'APPROVED',
          adjudicatedAmount: 2720,
        },
        {
          itemId: 'ITEM-HIST-02',
          procedureCode: 'CPT-93000',
          description: '12-lead electrocardiogram with interpretation',
          category: 'MEDICAL',
          serviceDate: new Date('2026-02-10'),
          billedAmount: 1650,
          feeScheduleAllowable: 1400,
          copay: 0,
          coinsurance: 0,
          eligiblePayout: 1400,
          clinicalReviewStatus: 'APPROVED',
          adjudicatedAmount: 1400,
        },
      ],
    } as any);
  }

  console.log('[OmniClaim Seeder] Master data successfully seeded.');
}
