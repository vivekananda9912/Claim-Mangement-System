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

  // 3. Seed Family Customer Master Records with National Healthcare IDs (HCIDs)
  const seedHouseholds = [
    {
      familyPolicyNumber: 'POL-HEALTH-2026-9812',
      familyHcid: 'HCID-8492-HOUSEHOLD',
      primarySubscriber: {
        memberId: 'MEM-9812-01',
        hcid: 'HCID-8492-1001-A',
        firstName: 'Eleanor',
        lastName: 'Vance',
        dob: new Date('1984-06-12'),
        relationship: 'PRIMARY_SUBSCRIBER',
        gender: 'FEMALE',
        ssnLast4: '4421',
        coverageStatus: 'ACTIVE',
      },
      dependents: [
        {
          memberId: 'MEM-9812-02',
          hcid: 'HCID-8492-1002-B',
          firstName: 'Arthur',
          lastName: 'Vance',
          dob: new Date('1982-11-20'),
          relationship: 'SPOUSE',
          gender: 'MALE',
          ssnLast4: '8832',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-9812-03',
          hcid: 'HCID-8492-1003-C',
          firstName: 'Chloe',
          lastName: 'Vance',
          dob: new Date('2014-04-15'),
          relationship: 'CHILD',
          gender: 'FEMALE',
          ssnLast4: '1099',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-9812-04',
          hcid: 'HCID-8492-1004-D',
          firstName: 'Leo',
          lastName: 'Vance',
          dob: new Date('2018-09-03'),
          relationship: 'CHILD',
          gender: 'MALE',
          ssnLast4: '9214',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-9812-05',
          hcid: 'HCID-8492-1005-E',
          firstName: 'Margaret',
          lastName: 'Vance',
          dob: new Date('1955-03-24'),
          relationship: 'PARENT',
          gender: 'FEMALE',
          ssnLast4: '3310',
          coverageStatus: 'ACTIVE',
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
    },
    {
      familyPolicyNumber: 'POL-HEALTH-2026-4410',
      familyHcid: 'HCID-4410-HOUSEHOLD',
      primarySubscriber: {
        memberId: 'MEM-4410-01',
        hcid: 'HCID-4410-2001-A',
        firstName: 'Marcus',
        lastName: 'Thorne',
        dob: new Date('1979-08-22'),
        relationship: 'PRIMARY_SUBSCRIBER',
        gender: 'MALE',
        ssnLast4: '5512',
        coverageStatus: 'ACTIVE',
      },
      dependents: [
        {
          memberId: 'MEM-4410-02',
          hcid: 'HCID-4410-2002-B',
          firstName: 'Helena',
          lastName: 'Thorne',
          dob: new Date('1981-01-14'),
          relationship: 'SPOUSE',
          gender: 'FEMALE',
          ssnLast4: '7721',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-4410-03',
          hcid: 'HCID-4410-2003-C',
          firstName: 'Lucas',
          lastName: 'Thorne',
          dob: new Date('2011-05-19'),
          relationship: 'CHILD',
          gender: 'MALE',
          ssnLast4: '8841',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-4410-04',
          hcid: 'HCID-4410-2004-D',
          firstName: 'George',
          lastName: 'Thorne',
          dob: new Date('1951-12-08'),
          relationship: 'PARENT',
          gender: 'MALE',
          ssnLast4: '2290',
          coverageStatus: 'ACTIVE',
        },
      ],
      contact: {
        email: 'marcus.thorne@example.com',
        phone: '+1 (415) 555-0321',
        address: {
          street: '880 Montgomery St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94133',
        },
      },
      status: 'ACTIVE',
    },
    {
      familyPolicyNumber: 'POL-HEALTH-2026-7721',
      familyHcid: 'HCID-7721-HOUSEHOLD',
      primarySubscriber: {
        memberId: 'MEM-7721-01',
        hcid: 'HCID-7721-3001-A',
        firstName: 'Julian',
        lastName: 'Sterling',
        dob: new Date('1986-03-30'),
        relationship: 'PRIMARY_SUBSCRIBER',
        gender: 'MALE',
        ssnLast4: '9920',
        coverageStatus: 'ACTIVE',
      },
      dependents: [
        {
          memberId: 'MEM-7721-02',
          hcid: 'HCID-7721-3002-B',
          firstName: 'Claire',
          lastName: 'Sterling',
          dob: new Date('1988-07-09'),
          relationship: 'SPOUSE',
          gender: 'FEMALE',
          ssnLast4: '6610',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-7721-03',
          hcid: 'HCID-7721-3003-C',
          firstName: 'Oliver',
          lastName: 'Sterling',
          dob: new Date('2016-10-22'),
          relationship: 'CHILD',
          gender: 'MALE',
          ssnLast4: '4401',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-7721-04',
          hcid: 'HCID-7721-3004-D',
          firstName: 'Sophie',
          lastName: 'Sterling',
          dob: new Date('2019-12-05'),
          relationship: 'CHILD',
          gender: 'FEMALE',
          ssnLast4: '7712',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-7721-05',
          hcid: 'HCID-7721-3005-E',
          firstName: 'Evelyn',
          lastName: 'Sterling',
          dob: new Date('1958-04-17'),
          relationship: 'PARENT',
          gender: 'FEMALE',
          ssnLast4: '1190',
          coverageStatus: 'ACTIVE',
        },
      ],
      contact: {
        email: 'julian.sterling@example.com',
        phone: '+1 (212) 555-0814',
        address: {
          street: '450 Lexington Ave',
          city: 'New York',
          state: 'NY',
          zip: '10017',
        },
      },
      status: 'ACTIVE',
    },
    {
      familyPolicyNumber: 'POL-HEALTH-2026-9150',
      familyHcid: 'HCID-9150-HOUSEHOLD',
      primarySubscriber: {
        memberId: 'MEM-9150-01',
        hcid: 'HCID-9150-4001-A',
        firstName: 'Carlos',
        lastName: 'Morales',
        dob: new Date('1980-09-15'),
        relationship: 'PRIMARY_SUBSCRIBER',
        gender: 'MALE',
        ssnLast4: '3819',
        coverageStatus: 'ACTIVE',
      },
      dependents: [
        {
          memberId: 'MEM-9150-02',
          hcid: 'HCID-9150-4002-B',
          firstName: 'Sofia',
          lastName: 'Morales',
          dob: new Date('1983-04-28'),
          relationship: 'SPOUSE',
          gender: 'FEMALE',
          ssnLast4: '4920',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-9150-03',
          hcid: 'HCID-9150-4003-C',
          firstName: 'Mateo',
          lastName: 'Morales',
          dob: new Date('2015-08-11'),
          relationship: 'CHILD',
          gender: 'MALE',
          ssnLast4: '5591',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-9150-04',
          hcid: 'HCID-9150-4004-D',
          firstName: 'Rosa',
          lastName: 'Morales',
          dob: new Date('1953-06-19'),
          relationship: 'PARENT',
          gender: 'FEMALE',
          ssnLast4: '8812',
          coverageStatus: 'ACTIVE',
        },
      ],
      contact: {
        email: 'carlos.morales@example.com',
        phone: '+1 (305) 555-0982',
        address: {
          street: '1200 Brickell Ave',
          city: 'Miami',
          state: 'FL',
          zip: '33131',
        },
      },
      status: 'ACTIVE',
    },
    {
      familyPolicyNumber: 'POL-HEALTH-2026-6208',
      familyHcid: 'HCID-6208-HOUSEHOLD',
      primarySubscriber: {
        memberId: 'MEM-6208-01',
        hcid: 'HCID-6208-5001-A',
        firstName: 'David',
        lastName: 'Chen',
        dob: new Date('1985-02-18'),
        relationship: 'PRIMARY_SUBSCRIBER',
        gender: 'MALE',
        ssnLast4: '6620',
        coverageStatus: 'ACTIVE',
      },
      dependents: [
        {
          memberId: 'MEM-6208-02',
          hcid: 'HCID-6208-5002-B',
          firstName: 'Mei-Ling',
          lastName: 'Chen',
          dob: new Date('1987-11-04'),
          relationship: 'SPOUSE',
          gender: 'FEMALE',
          ssnLast4: '7741',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-6208-03',
          hcid: 'HCID-6208-5003-C',
          firstName: 'Daniel',
          lastName: 'Chen',
          dob: new Date('2017-06-25'),
          relationship: 'CHILD',
          gender: 'MALE',
          ssnLast4: '8839',
          coverageStatus: 'ACTIVE',
        },
        {
          memberId: 'MEM-6208-04',
          hcid: 'HCID-6208-5004-D',
          firstName: 'Wei-Hsin',
          lastName: 'Chen',
          dob: new Date('1956-08-30'),
          relationship: 'PARENT',
          gender: 'MALE',
          ssnLast4: '9910',
          coverageStatus: 'ACTIVE',
        },
      ],
      contact: {
        email: 'david.chen@example.com',
        phone: '+1 (206) 555-0456',
        address: {
          street: '400 Pine St',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
        },
      },
      status: 'ACTIVE',
    },
  ];

  for (const h of seedHouseholds) {
    const existing = await customerService.getByFamilyPolicyNumber(h.familyPolicyNumber);
    if (!existing) {
      await customerService.createCustomer(h as any);
    }
  }

  // 4. Seed Policy Master Records with family deductibles & schedules
  const seedPolicies = [
    {
      policyNumber: 'POL-HEALTH-2026-9812',
      planCode: 'PPO-PLATINUM-SHIELD',
      planName: 'OmniCare Platinum Family Shield PPO',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_1_PREFERRED',
      familyFinancials: {
        annualDeductible: 3000,
        deductibleMetToDate: 1800,
        outOfPocketMax: 8000,
        outOfPocketMetToDate: 1800,
      },
      categoryCoverages: [
        { category: 'MEDICAL', copay: 40, coinsurancePercentage: 20, maxLifetimeBenefit: 500000, requiresPreAuth: false },
        { category: 'PHARMACY', copay: 20, coinsurancePercentage: 15, maxLifetimeBenefit: 250000, requiresPreAuth: false },
        { category: 'PRESCRIPTION', copay: 15, coinsurancePercentage: 10, maxLifetimeBenefit: 200000, requiresPreAuth: false },
        { category: 'BEHAVIORAL_HEALTH', copay: 25, coinsurancePercentage: 15, maxLifetimeBenefit: 300000, requiresPreAuth: false },
      ],
      exclusions: ['COSMETIC_RHINOPLASTY', 'EXPERIMENTAL_GENE_THERAPY'],
      preAuthRequiredProcedures: ['CPT-99223', 'CPT-33533', 'CPT-70553'],
    },
    {
      policyNumber: 'POL-HEALTH-2026-4410',
      planCode: 'POS-EMERALD-CHOICE',
      planName: 'BlueCross Emerald Choice POS',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_1_PREFERRED',
      familyFinancials: {
        annualDeductible: 2500,
        deductibleMetToDate: 2100,
        outOfPocketMax: 6500,
        outOfPocketMetToDate: 2100,
      },
      categoryCoverages: [
        { category: 'MEDICAL', copay: 30, coinsurancePercentage: 15, maxLifetimeBenefit: 600000, requiresPreAuth: false },
        { category: 'PHARMACY', copay: 15, coinsurancePercentage: 10, maxLifetimeBenefit: 300000, requiresPreAuth: false },
        { category: 'PRESCRIPTION', copay: 10, coinsurancePercentage: 10, maxLifetimeBenefit: 250000, requiresPreAuth: false },
        { category: 'BEHAVIORAL_HEALTH', copay: 20, coinsurancePercentage: 10, maxLifetimeBenefit: 350000, requiresPreAuth: false },
      ],
      exclusions: ['ELECTIVE_COSMETIC'],
      preAuthRequiredProcedures: ['CPT-99223', 'CPT-47562'],
    },
    {
      policyNumber: 'POL-HEALTH-2026-7721',
      planCode: 'HDHP-BIOHEALTH-COMP',
      planName: 'Apex BioHealth Comprehensive HDHP',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_2_STANDARD',
      familyFinancials: {
        annualDeductible: 4500,
        deductibleMetToDate: 950,
        outOfPocketMax: 9500,
        outOfPocketMetToDate: 950,
      },
      categoryCoverages: [
        { category: 'MEDICAL', copay: 50, coinsurancePercentage: 25, maxLifetimeBenefit: 750000, requiresPreAuth: false },
        { category: 'PHARMACY', copay: 25, coinsurancePercentage: 20, maxLifetimeBenefit: 350000, requiresPreAuth: false },
        { category: 'PRESCRIPTION', copay: 20, coinsurancePercentage: 15, maxLifetimeBenefit: 300000, requiresPreAuth: false },
        { category: 'BEHAVIORAL_HEALTH', copay: 35, coinsurancePercentage: 20, maxLifetimeBenefit: 400000, requiresPreAuth: false },
      ],
      exclusions: ['EXPERIMENTAL_CELL_THERAPY'],
      preAuthRequiredProcedures: ['CPT-70553', 'CPT-27447'],
    },
    {
      policyNumber: 'POL-HEALTH-2026-9150',
      planCode: 'HMO-GOLD-SELECT',
      planName: 'United Horizon Gold Select HMO',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_1_PREFERRED',
      familyFinancials: {
        annualDeductible: 1500,
        deductibleMetToDate: 1250,
        outOfPocketMax: 5000,
        outOfPocketMetToDate: 1250,
      },
      categoryCoverages: [
        { category: 'MEDICAL', copay: 25, coinsurancePercentage: 10, maxLifetimeBenefit: 1000000, requiresPreAuth: false },
        { category: 'PHARMACY', copay: 10, coinsurancePercentage: 10, maxLifetimeBenefit: 400000, requiresPreAuth: false },
        { category: 'PRESCRIPTION', copay: 10, coinsurancePercentage: 5, maxLifetimeBenefit: 350000, requiresPreAuth: false },
        { category: 'BEHAVIORAL_HEALTH', copay: 20, coinsurancePercentage: 10, maxLifetimeBenefit: 500000, requiresPreAuth: false },
      ],
      exclusions: ['WEIGHT_LOSS_SURGERY'],
      preAuthRequiredProcedures: ['CPT-99223', 'CPT-29881'],
    },
    {
      policyNumber: 'POL-HEALTH-2026-6208',
      planCode: 'EPO-PREMIER-TOTAL',
      planName: 'Kaiser Premier Total Health EPO',
      status: 'ACTIVE',
      effectiveDate: new Date('2026-01-01'),
      expirationDate: new Date('2026-12-31'),
      networkTier: 'TIER_1_PREFERRED',
      familyFinancials: {
        annualDeductible: 2000,
        deductibleMetToDate: 1600,
        outOfPocketMax: 6000,
        outOfPocketMetToDate: 1600,
      },
      categoryCoverages: [
        { category: 'MEDICAL', copay: 20, coinsurancePercentage: 15, maxLifetimeBenefit: 800000, requiresPreAuth: false },
        { category: 'PHARMACY', copay: 15, coinsurancePercentage: 10, maxLifetimeBenefit: 350000, requiresPreAuth: false },
        { category: 'PRESCRIPTION', copay: 10, coinsurancePercentage: 10, maxLifetimeBenefit: 300000, requiresPreAuth: false },
        { category: 'BEHAVIORAL_HEALTH', copay: 20, coinsurancePercentage: 10, maxLifetimeBenefit: 450000, requiresPreAuth: false },
      ],
      exclusions: ['ACUPUNCTURE_MAINTENANCE'],
      preAuthRequiredProcedures: ['CPT-70553'],
    },
  ];

  for (const pol of seedPolicies) {
    const existing = await policyService.getByPolicyNumber(pol.policyNumber);
    if (!existing) {
      await policyService.createPolicy(pol as any);
    }
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
