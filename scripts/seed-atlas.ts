/**
 * Seed MongoDB Atlas Database with Full Enterprise Master Data
 * Includes 65+ Households (216+ Members), Policies, Claims, Cases, Tasks,
 * Evidences, Fraud Assessments, Event Audit Trails, and Doctors.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { seedDatabase } from '../src/db/seed';
import {
  INITIAL_CUSTOMERS,
  INITIAL_POLICIES,
  INITIAL_DOCTORS,
  INITIAL_CASES,
  INITIAL_CLAIMS,
  INITIAL_TASKS,
  INITIAL_EVIDENCES,
  INITIAL_FRAUD_ASSESSMENTS,
  INITIAL_EVENTS,
  USER_PERSONAS,
} from '../src/data/mockData';
import {
  EXTENDED_CUSTOMERS,
  EXTENDED_POLICIES,
  EXTENDED_CLAIMS,
} from '../src/data/extendedMembers';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://vangetivivek_db_user:YIBmEW25m8xQqvXV@cluster0.mo7u0lh.mongodb.net/omniclaim?retryWrites=true&w=majority';

async function seedAtlas() {
  console.log('Connecting to MongoDB Atlas at:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

  const conn = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  const db = conn.connection.db;
  if (!db) {
    throw new Error('Database connection failed: db instance is null');
  }

  console.log(`Connected to database: ${conn.connection.name}`);

  // 1. Wipe collections cleanly to guarantee fresh state
  const collections = [
    'customers',
    'policies',
    'claims',
    'cases',
    'tasks',
    'evidences',
    'fraud_assessments',
    'events',
    'doctors',
    'users',
  ];
  for (const c of collections) {
    try {
      await db.collection(c).deleteMany({});
    } catch {}
  }

  // 2. Run enterprise seeder for baseline testing and system schemas
  console.log('Running enterprise master seeder...');
  await seedDatabase();

  // 3. Upsert extended 65+ households, policies, and claims
  console.log('Upserting extended 65+ households (216 members) and claims...');

  // Map policies to support BOTH Mongoose model format AND frontend store format
  const mappedExtendedPolicies = EXTENDED_POLICIES.map((p) => ({
    _id: p._id,
    policyNumber: p.policyNumber,
    planCode: p.policyNumber.replace('POL-2026-', 'PPO-GOLD-'),
    planName: p.planName,
    status: p.status,
    effectiveDate: new Date(p.effectiveDate),
    expirationDate: new Date(p.expirationDate),
    networkTier: p.networkType === 'IN_NETWORK' ? 'TIER_1_PREFERRED' : 'OUT_OF_NETWORK',
    networkType: p.networkType,
    financials: p.financials,
    familyFinancials: {
      annualDeductible: p.financials.familyDeductible,
      deductibleMetToDate: p.financials.familyDeductibleMet,
      outOfPocketMax: p.financials.outOfPocketMax,
      outOfPocketMetToDate: p.financials.outOfPocketMet,
    },
    coverages: p.coverages,
    categoryCoverages: p.coverages.map((c) => ({
      category: c.category,
      copay: c.copay,
      coinsurancePercentage: c.coinsurancePct,
      maxLifetimeBenefit: c.maxBenefit,
      requiresPreAuth: false,
    })),
    exclusions: p.exclusions,
    preAuthRequiredProcedures: p.requiresPreAuthCodes,
    requiresPreAuthCodes: p.requiresPreAuthCodes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const policiesCol = db.collection('policies');
  for (const pol of mappedExtendedPolicies) {
    await policiesCol.updateOne({ policyNumber: pol.policyNumber }, { $set: pol }, { upsert: true });
  }

  // Upsert extended customers
  const customersCol = db.collection('customers');
  for (const cust of EXTENDED_CUSTOMERS) {
    await customersCol.updateOne({ familyHcid: cust.familyHcid }, { $set: cust }, { upsert: true });
  }

  // Upsert extended claims
  const claimsCol = db.collection('claims');
  for (const cl of EXTENDED_CLAIMS) {
    await claimsCol.updateOne({ claimId: cl.claimId }, { $set: cl }, { upsert: true });
  }

  // 4. Seed Cases (including case-005 with Duplicate Checked & Resolved)
  const casesCol = db.collection('cases');
  for (const cs of INITIAL_CASES) {
    await casesCol.updateOne({ _id: cs._id as any }, { $set: cs }, { upsert: true });
  }

  // 5. Seed Tasks
  const tasksCol = db.collection('tasks');
  for (const t of INITIAL_TASKS) {
    await tasksCol.updateOne({ _id: t._id as any }, { $set: t }, { upsert: true });
  }

  // 6. Seed Evidences
  const evidencesCol = db.collection('evidences');
  for (const ev of INITIAL_EVIDENCES) {
    await evidencesCol.updateOne({ dcnId: ev.dcnId }, { $set: { ...ev, _id: ev.dcnId } }, { upsert: true });
  }

  // 7. Seed Fraud Assessments
  const fraudCol = db.collection('fraud_assessments');
  for (const fr of INITIAL_FRAUD_ASSESSMENTS) {
    await fraudCol.updateOne({ _id: ((fr as any)._id || (fr as any).assessmentId) as any }, { $set: fr }, { upsert: true });
  }

  // 8. Seed Events
  const eventsCol = db.collection('events');
  for (const event of INITIAL_EVENTS) {
    await eventsCol.updateOne({ eventId: event.eventId }, { $set: event }, { upsert: true });
  }

  // 9. Seed Doctors
  const doctorsCol = db.collection('doctors');
  for (const doc of INITIAL_DOCTORS) {
    await doctorsCol.updateOne({ doctorId: doc.doctorId }, { $set: { ...doc, _id: doc.doctorId } }, { upsert: true });
  }

  const [totalCust, totalPol, totalClaims, totalCases] = await Promise.all([
    customersCol.countDocuments(),
    policiesCol.countDocuments(),
    claimsCol.countDocuments(),
    casesCol.countDocuments(),
  ]);

  console.log('\n======================================================');
  console.log('MongoDB Atlas Database Seed Successfully Completed!');
  console.log(`Database: ${conn.connection.name}`);
  console.log(`Total Customers in Atlas: ${totalCust}`);
  console.log(`Total Policies in Atlas: ${totalPol}`);
  console.log(`Total Claims in Atlas: ${totalClaims}`);
  console.log(`Total Cases in Atlas: ${totalCases}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
  console.log('Disconnected cleanly from MongoDB Atlas.');
}

seedAtlas().catch((err) => {
  console.error('Failed to seed MongoDB Atlas:', err);
  process.exit(1);
});
