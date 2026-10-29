/**
 * Data Generator: 200+ Healthcare Members, Households, Policies, and Claims
 * Generates data matching exact omniclaim-health TypeScript types.
 */

import fs from 'fs';
import path from 'path';
import { Customer, Policy, Claim, FamilyMember, CategoryCoverage, ClaimItem } from '../src/types';

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Alexander', 'Debra',
  'Frank', 'Rachel', 'Patrick', 'Catherine', 'Raymond', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza'
];

const CITIES = [
  { city: 'Springfield', state: 'IL', zip: '62701' },
  { city: 'Chicago', state: 'IL', zip: '60601' },
  { city: 'Austin', state: 'TX', zip: '78701' },
  { city: 'Columbus', state: 'OH', zip: '43215' },
  { city: 'Seattle', state: 'WA', zip: '98101' },
  { city: 'Denver', state: 'CO', zip: '80202' },
  { city: 'Atlanta', state: 'GA', zip: '30303' },
  { city: 'Boston', state: 'MA', zip: '02108' },
  { city: 'Phoenix', state: 'AZ', zip: '85001' },
  { city: 'Charlotte', state: 'NC', zip: '28202' },
];

const PLAN_TEMPLATES = [
  { name: 'Platinum Comprehensive Shield PPO', network: 'IN_NETWORK' as const, dedFam: 2500, dedInd: 750, oop: 6000, copays: [30, 20, 25, 10] },
  { name: 'Gold Choice Value Managed Care', network: 'IN_NETWORK' as const, dedFam: 3500, dedInd: 1200, oop: 7500, copays: [40, 25, 30, 15] },
  { name: 'Silver Select Essential HMO', network: 'IN_NETWORK' as const, dedFam: 5000, dedInd: 2000, oop: 9000, copays: [50, 30, 40, 20] },
  { name: 'Diamond Executive Premier PPO', network: 'OUT_OF_NETWORK' as const, dedFam: 1500, dedInd: 500, oop: 4500, copays: [20, 15, 15, 5] },
];

const PROCEDURES = [
  { code: 'CPT-99213', desc: 'Office/outpatient visit, low complexity, 20-29 mins', cat: 'MEDICAL' as const, billed: 220, allow: 160 },
  { code: 'CPT-99214', desc: 'Office/outpatient visit, moderate complexity, 30-39 mins', cat: 'MEDICAL' as const, billed: 380, allow: 280 },
  { code: 'CPT-99215', desc: 'Office/outpatient visit, high complexity, 40-54 mins', cat: 'MEDICAL' as const, billed: 560, allow: 420 },
  { code: 'CPT-70553', desc: 'MRI brain without & with contrast material', cat: 'MEDICAL' as const, billed: 2400, allow: 1800 },
  { code: 'CPT-71260', desc: 'CT thorax diagnostic with contrast', cat: 'MEDICAL' as const, billed: 1850, allow: 1350 },
  { code: 'CPT-29881', desc: 'Arthroscopy, knee, surgical; with meniscectomy', cat: 'MEDICAL' as const, billed: 4800, allow: 3600 },
  { code: 'CPT-90834', desc: 'Psychotherapy, 45 minutes with patient', cat: 'BEHAVIORAL_HEALTH' as const, billed: 240, allow: 190 },
  { code: 'CPT-73721', desc: 'MRI lower extremity joint without contrast', cat: 'MEDICAL' as const, billed: 1750, allow: 1250 },
  { code: 'NDC-9021', desc: 'Specialty Immunotherapy maintenance dose', cat: 'PRESCRIPTION' as const, billed: 1200, allow: 980 },
  { code: 'NDC-4001', desc: 'Maintenance prescription specialty injection', cat: 'PHARMACY' as const, billed: 650, allow: 520 },
];

const PROVIDERS: Array<{ npi: string; name: string; facilityType: 'INSTITUTIONAL' | 'PHYSICIAN_GROUP' | 'SPECIALTY_CLINIC'; address: string }> = [
  { npi: '1982736450', name: 'Metropolitan Surgical & Medical Center', facilityType: 'INSTITUTIONAL', address: '742 Evergreen Terrace, Springfield, IL' },
  { npi: '1492019482', name: 'Advanced Diagnostic Imaging Institute', facilityType: 'SPECIALTY_CLINIC', address: '450 West Roosevelt Rd, Chicago, IL' },
  { npi: '1837492019', name: 'Island Neuropsychology & Behavioral Health', facilityType: 'PHYSICIAN_GROUP', address: '1088 Bishop St Suite 400, Honolulu, HI' },
  { npi: '1728394012', name: 'Horizon Community Health & Wellness', facilityType: 'INSTITUTIONAL', address: '1200 University Ave, Austin, TX' },
  { npi: '1638291045', name: 'Pacific Northwest Specialty Care', facilityType: 'SPECIALTY_CLINIC', address: '800 5th Ave, Seattle, WA' },
];

function generateDataset() {
  const customers: Customer[] = [];
  const policies: Policy[] = [];
  const claims: Claim[] = [];
  let memberCounter = 1001;

  // Generate 65 households (3 to 4 members each = ~220 members total)
  for (let h = 1; h <= 65; h++) {
    const householdNum = 1000 + h;
    const familyHcid = `HCID-${householdNum}-HOUSEHOLD`;
    const policyNumber = `POL-2026-${householdNum}`;
    const plan = PLAN_TEMPLATES[h % PLAN_TEMPLATES.length];
    const loc = CITIES[h % CITIES.length];

    const lastName = LAST_NAMES[h % LAST_NAMES.length];
    const primaryFirst = FIRST_NAMES[(h * 3) % FIRST_NAMES.length];

    const primaryMemberId = `MEM-${memberCounter}`;
    const primaryHcid = `HCID-${memberCounter}-A`;
    memberCounter++;

    const primarySubscriber: FamilyMember = {
      memberId: primaryMemberId,
      hcid: primaryHcid,
      firstName: primaryFirst,
      lastName,
      dob: `198${(h % 10) + 1}-0${(h % 9) + 1}-15`,
      gender: h % 2 === 0 ? 'MALE' : 'FEMALE',
      relationship: 'PRIMARY_SUBSCRIBER',
      coverageStatus: 'ACTIVE',
    };

    const dependents: FamilyMember[] = [];

    // Spouse
    const spouseFirst = FIRST_NAMES[(h * 7 + 1) % FIRST_NAMES.length];
    const spouseHcid = `HCID-${memberCounter}-B`;
    dependents.push({
      memberId: `MEM-${memberCounter}`,
      hcid: spouseHcid,
      firstName: spouseFirst,
      lastName,
      dob: `198${(h % 10) + 2}-0${((h + 3) % 9) + 1}-20`,
      gender: h % 2 === 0 ? 'FEMALE' : 'MALE',
      relationship: 'SPOUSE',
      coverageStatus: 'ACTIVE',
    });
    memberCounter++;

    // Child
    const childFirst = FIRST_NAMES[(h * 11 + 2) % FIRST_NAMES.length];
    const childHcid = `HCID-${memberCounter}-C`;
    dependents.push({
      memberId: `MEM-${memberCounter}`,
      hcid: childHcid,
      firstName: childFirst,
      lastName,
      dob: `201${(h % 8) + 1}-0${((h + 5) % 9) + 1}-10`,
      gender: (h + 1) % 2 === 0 ? 'MALE' : 'FEMALE',
      relationship: 'CHILD',
      coverageStatus: 'ACTIVE',
    });
    memberCounter++;

    // Parent dependent (every 3rd household)
    if (h % 3 === 0) {
      const parentFirst = FIRST_NAMES[(h * 13 + 5) % FIRST_NAMES.length];
      const parentHcid = `HCID-${memberCounter}-P`;
      dependents.push({
        memberId: `MEM-${memberCounter}`,
        hcid: parentHcid,
        firstName: parentFirst,
        lastName,
        dob: `195${(h % 9) + 1}-0${((h + 2) % 9) + 1}-05`,
        gender: (h + 2) % 2 === 0 ? 'MALE' : 'FEMALE',
        relationship: 'PARENT',
        coverageStatus: 'ACTIVE',
      });
      memberCounter++;
    }

    const customer: Customer = {
      _id: `cust-${householdNum}`,
      familyPolicyNumber: policyNumber,
      familyHcid,
      primarySubscriber,
      dependents,
      contact: {
        address: `${100 + h * 12} Oak Valley Parkway, ${loc.city}, ${loc.state} ${loc.zip}`,
        phone: `(555) ${(h * 17 + 100).toString().padStart(3, '0')}-${(householdNum * 2).toString().slice(-4)}`,
        email: `${primaryFirst.toLowerCase()}.${lastName.toLowerCase()}@healthmail.com`,
      },
      createdAt: '2026-01-10T08:00:00Z',
    };
    customers.push(customer);

    // Create linked Policy
    const dedMet = Math.min(plan.dedFam, Math.round(plan.dedFam * ((h % 5) * 0.25)));

    const coverages: CategoryCoverage[] = [
      { category: 'MEDICAL', copay: plan.copays[0], coinsurancePct: 0.2, maxBenefit: 500000, accumulatedPaid: 12000 },
      { category: 'PHARMACY', copay: plan.copays[1], coinsurancePct: 0.15, maxBenefit: 25000, accumulatedPaid: 1500 },
      { category: 'BEHAVIORAL_HEALTH', copay: plan.copays[2], coinsurancePct: 0.1, maxBenefit: 100000, accumulatedPaid: 3200 },
      { category: 'PRESCRIPTION', copay: plan.copays[3], coinsurancePct: 0.15, maxBenefit: 50000, accumulatedPaid: 2100 },
    ];

    const policy: Policy = {
      _id: `pol-${householdNum}`,
      policyNumber,
      planName: `${plan.name} (Household ${householdNum})`,
      status: 'ACTIVE',
      effectiveDate: '2026-01-01T00:00:00Z',
      expirationDate: '2026-12-31T23:59:59Z',
      networkType: plan.network,
      financials: {
        familyDeductible: plan.dedFam,
        familyDeductibleMet: dedMet,
        outOfPocketMax: plan.oop,
        outOfPocketMet: Math.round(dedMet * 1.4),
      },
      coverages,
      exclusions: ['COSMETIC_SURGERY', 'EXPERIMENTAL_THERAPY'],
      requiresPreAuthCodes: ['CPT-29881', 'CPT-70553'],
    };
    policies.push(policy);

    // Create linked Claim
    const prov = PROVIDERS[h % PROVIDERS.length];
    const proc = PROCEDURES[h % PROCEDURES.length];
    const claimId = `CLM-2026-${householdNum}`;
    const claimItem: ClaimItem = {
      itemId: `ITM-${householdNum}-1`,
      code: proc.code,
      description: proc.desc,
      category: proc.cat,
      startDate: `2026-0${(h % 3) + 1}-15`,
      billedAmount: proc.billed,
      allowableAmount: proc.allow,
      copay: plan.copays[0],
      coinsurance: Math.round((proc.allow - plan.copays[0]) * 0.2),
      eligiblePayout: Math.round((proc.allow - plan.copays[0]) * 0.8),
      clinicalDecision: 'PENDING',
    };

    const claim: Claim = {
      _id: `claim-${householdNum}`,
      claimId,
      caseId: `case-${householdNum}`,
      provider: prov,
      serviceDate: `2026-0${(h % 3) + 1}-15T09:30:00Z`,
      totalBilledAmount: proc.billed,
      items: [claimItem],
      preAuthNumber: `PA-2026-${householdNum}`,
    };
    claims.push(claim);
  }

  // Ensure target output directory exists
  const projectRootDir = process.cwd();
  const dataDir = path.join(projectRootDir, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write JSON files
  fs.writeFileSync(path.join(dataDir, 'members.json'), JSON.stringify(customers, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'policies.json'), JSON.stringify(policies, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dataDir, 'claims.json'), JSON.stringify(claims, null, 2), 'utf-8');

  // Also write TypeScript export file in src/data/extendedMembers.ts
  const tsContent = `/**
 * Extended Master Dataset: 200+ Members, Households, Policies, and Claims
 * Auto-generated on demand for Healthcare Member Search & Eligibility Service.
 */

import { Customer, Policy, Claim } from '../types';

export const EXTENDED_CUSTOMERS: Customer[] = ${JSON.stringify(customers, null, 2)};
export const EXTENDED_POLICIES: Policy[] = ${JSON.stringify(policies, null, 2)};
export const EXTENDED_CLAIMS: Claim[] = ${JSON.stringify(claims, null, 2)};
`;

  fs.writeFileSync(path.join(projectRootDir, 'src', 'data', 'extendedMembers.ts'), tsContent, 'utf-8');

  console.log(`Successfully generated ${customers.length} households (${memberCounter - 1001} members) with linked policies & claims.`);
}

generateDataset();
