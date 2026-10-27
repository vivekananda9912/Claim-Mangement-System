/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerModel, ICustomer, IFamilyMember } from '../customer/customer.model';
import { PolicyModel, IPolicy } from '../policy/policy.model';

export interface EligibilitySubscriberResult {
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'SUSPENDED';
  hcid: string;
  nationalRegistryId: string;
  memberId: string;
  relationship: 'PRIMARY_SUBSCRIBER' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'DEPENDENT';
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  gender: string;
  coverageStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  household: {
    familyHcid: string;
    familyPolicyNumber: string;
    headOfHousehold: {
      hcid: string;
      memberId: string;
      fullName: string;
    };
    subscribers: Array<{
      hcid: string;
      memberId: string;
      firstName: string;
      lastName: string;
      fullName: string;
      relationship: 'PRIMARY_SUBSCRIBER' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'DEPENDENT';
      dob: string;
      gender: string;
      coverageStatus: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
    }>;
  };
  policy?: {
    policyNumber: string;
    planCode: string;
    planName: string;
    status: string;
    networkTier: string;
    effectiveDate: string;
    expirationDate: string;
    familyFinancials: {
      annualDeductible: number;
      deductibleMetToDate: number;
      deductibleRemaining: number;
      outOfPocketMax: number;
      outOfPocketMetToDate: number;
    };
    categoryCoverages: Array<{
      category: string;
      copay: number;
      coinsurancePercentage: number;
      maxLifetimeBenefit: number;
      requiresPreAuth: boolean;
    }>;
    exclusions: string[];
    preAuthRequiredProcedures: string[];
  };
}

export class EligibilityService {
  /**
   * National Healthcare ID (HCID) Eligibility Service Lookup
   * GET /v2/eligibility/subscribers
   */
  async searchSubscribers(params: {
    hcid?: string;
    query?: string;
    policyNumber?: string;
    relationship?: string;
    limit?: number;
  }): Promise<{
    metadata: {
      clearinghouse: string;
      serviceEndpoint: string;
      specification: string;
      queryTimestamp: string;
      count: number;
    };
    data: EligibilitySubscriberResult[];
  }> {
    const customers = await CustomerModel.find().exec();
    const policies = await PolicyModel.find().exec();

    const policyMap = new Map<string, IPolicy>();
    policies.forEach((p) => {
      policyMap.set(p.policyNumber, p);
    });

    const results: EligibilitySubscriberResult[] = [];
    const searchHcid = (params.hcid || '').trim().toLowerCase();
    const searchQuery = (params.query || '').trim().toLowerCase();
    const searchPolicy = (params.policyNumber || '').trim().toLowerCase();
    const searchRel = (params.relationship || '').trim().toUpperCase();

    for (const cust of customers) {
      const pol = policyMap.get(cust.familyPolicyNumber);

      // Collect all subscribers in this household
      const allMembers: IFamilyMember[] = [
        cust.primarySubscriber,
        ...(cust.dependents || []),
      ];

      // Format household subscribers
      const householdSubscribers = allMembers.map((m) => {
        const rel = m.relationship === 'PRIMARY' ? 'PRIMARY_SUBSCRIBER' : m.relationship;
        return {
          hcid: m.hcid,
          memberId: m.memberId,
          firstName: m.firstName,
          lastName: m.lastName,
          fullName: `${m.firstName} ${m.lastName}`,
          relationship: rel as any,
          dob: m.dob instanceof Date ? m.dob.toISOString().split('T')[0] : String(m.dob),
          gender: m.gender,
          coverageStatus: m.coverageStatus || 'ACTIVE',
        };
      });

      for (const member of allMembers) {
        const rel = member.relationship === 'PRIMARY' ? 'PRIMARY_SUBSCRIBER' : member.relationship;
        const fullName = `${member.firstName} ${member.lastName}`;
        const memberHcid = (member.hcid || '').toLowerCase();
        const familyHcid = (cust.familyHcid || '').toLowerCase();
        const memberPolicy = (cust.familyPolicyNumber || '').toLowerCase();
        const memberId = (member.memberId || '').toLowerCase();

        let matches = true;

        if (searchHcid) {
          const directMatch =
            memberHcid.includes(searchHcid) || familyHcid.includes(searchHcid);
          if (!directMatch) matches = false;
        }

        if (matches && searchQuery) {
          const queryMatch =
            memberHcid.includes(searchQuery) ||
            familyHcid.includes(searchQuery) ||
            fullName.toLowerCase().includes(searchQuery) ||
            memberPolicy.includes(searchQuery) ||
            memberId.includes(searchQuery);
          if (!queryMatch) matches = false;
        }

        if (matches && searchPolicy) {
          if (!memberPolicy.includes(searchPolicy)) matches = false;
        }

        if (matches && searchRel) {
          if (rel !== searchRel) matches = false;
        }

        if (matches) {
          const primaryRel = cust.primarySubscriber.relationship === 'PRIMARY' ? 'PRIMARY_SUBSCRIBER' : cust.primarySubscriber.relationship;
          const deductibleRemaining = pol
            ? Math.max(0, pol.familyFinancials.annualDeductible - pol.familyFinancials.deductibleMetToDate)
            : 0;

          results.push({
            status: member.coverageStatus === 'ACTIVE' || cust.status === 'ACTIVE' ? 'ELIGIBLE' : 'INELIGIBLE',
            hcid: member.hcid,
            nationalRegistryId: `NHIC-US-${member.hcid.replace(/[^A-Za-z0-9]/g, '')}`,
            memberId: member.memberId,
            relationship: rel as any,
            firstName: member.firstName,
            lastName: member.lastName,
            fullName,
            dob: member.dob instanceof Date ? member.dob.toISOString().split('T')[0] : String(member.dob),
            gender: member.gender,
            coverageStatus: member.coverageStatus || 'ACTIVE',
            household: {
              familyHcid: cust.familyHcid,
              familyPolicyNumber: cust.familyPolicyNumber,
              headOfHousehold: {
                hcid: cust.primarySubscriber.hcid,
                memberId: cust.primarySubscriber.memberId,
                fullName: `${cust.primarySubscriber.firstName} ${cust.primarySubscriber.lastName}`,
              },
              subscribers: householdSubscribers,
            },
            policy: pol
              ? {
                  policyNumber: pol.policyNumber,
                  planCode: pol.planCode,
                  planName: pol.planName,
                  status: pol.status,
                  networkTier: pol.networkTier,
                  effectiveDate: pol.effectiveDate instanceof Date ? pol.effectiveDate.toISOString().split('T')[0] : String(pol.effectiveDate),
                  expirationDate: pol.expirationDate instanceof Date ? pol.expirationDate.toISOString().split('T')[0] : String(pol.expirationDate),
                  familyFinancials: {
                    annualDeductible: pol.familyFinancials.annualDeductible,
                    deductibleMetToDate: pol.familyFinancials.deductibleMetToDate,
                    deductibleRemaining,
                    outOfPocketMax: pol.familyFinancials.outOfPocketMax,
                    outOfPocketMetToDate: pol.familyFinancials.outOfPocketMetToDate,
                  },
                  categoryCoverages: pol.categoryCoverages.map((c) => ({
                    category: c.category,
                    copay: c.copay,
                    coinsurancePercentage: c.coinsurancePercentage,
                    maxLifetimeBenefit: c.maxLifetimeBenefit,
                    requiresPreAuth: c.requiresPreAuth,
                  })),
                  exclusions: pol.exclusions || [],
                  preAuthRequiredProcedures: pol.preAuthRequiredProcedures || [],
                }
              : undefined,
          });
        }
      }
    }

    const limit = params.limit && params.limit > 0 ? params.limit : 50;
    const finalData = results.slice(0, limit);

    return {
      metadata: {
        clearinghouse: 'National Healthcare Identifier Clearinghouse (NHIC)',
        serviceEndpoint: '/v2/eligibility/subscribers',
        specification: 'ANSI ASC X12N 270/271 (005010X279A1) + FHIR R4 Coverage/Eligibility',
        queryTimestamp: new Date().toISOString(),
        count: finalData.length,
      },
      data: finalData,
    };
  }

  /**
   * Direct lookup by unique HCID
   * GET /v2/eligibility/subscribers/:hcid
   */
  async getSubscriberByHcid(hcid: string): Promise<EligibilitySubscriberResult | null> {
    const res = await this.searchSubscribers({ hcid, limit: 1 });
    return res.data.length > 0 ? res.data[0] : null;
  }
}

export const eligibilityService = new EligibilityService();
