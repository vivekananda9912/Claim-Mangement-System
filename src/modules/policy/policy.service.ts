/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PolicyModel, IPolicy, CareCategory } from './policy.model';
import { CustomerModel } from '../customer/customer.model';

export interface EligibilityResult {
  isEligible: boolean;
  policy: IPolicy | null;
  patient: {
    memberId: string;
    fullName: string;
    relationship: string;
  } | null;
  categoryBenefit: {
    category: CareCategory;
    copay: number;
    coinsurancePercentage: number;
    requiresPreAuth: boolean;
  } | null;
  deductibleRemaining: number;
  outOfPocketRemaining: number;
  message: string;
}

export class PolicyService {
  async createPolicy(data: Partial<IPolicy>): Promise<IPolicy> {
    const policy = new PolicyModel(data);
    return await policy.save();
  }

  async getByPolicyNumber(policyNumber: string): Promise<IPolicy | null> {
    return await PolicyModel.findOne({ policyNumber }).exec();
  }

  async listAllPolicies(): Promise<IPolicy[]> {
    return await PolicyModel.find().sort({ policyNumber: 1 }).exec();
  }

  /**
   * Deterministic Policy & Family Member Eligibility Evaluation (Stage 1 Rule)
   */
  async verifyEligibility(params: {
    familyPolicyNumber: string;
    patientMemberId: string;
    careCategory: CareCategory;
    serviceDate: Date;
  }): Promise<EligibilityResult> {
    const policy = await PolicyModel.findOne({ policyNumber: params.familyPolicyNumber }).exec();

    if (!policy) {
      return {
        isEligible: false,
        policy: null,
        patient: null,
        categoryBenefit: null,
        deductibleRemaining: 0,
        outOfPocketRemaining: 0,
        message: `Policy '${params.familyPolicyNumber}' does not exist in master registry.`,
      };
    }

    if (policy.status !== 'ACTIVE') {
      return {
        isEligible: false,
        policy,
        patient: null,
        categoryBenefit: null,
        deductibleRemaining: 0,
        outOfPocketRemaining: 0,
        message: `Policy '${policy.policyNumber}' is currently ${policy.status}. Coverage is suspended.`,
      };
    }

    const sTime = new Date(params.serviceDate).getTime();
    const effTime = new Date(policy.effectiveDate).getTime();
    const expTime = new Date(policy.expirationDate).getTime();

    if (sTime < effTime || sTime > expTime) {
      return {
        isEligible: false,
        policy,
        patient: null,
        categoryBenefit: null,
        deductibleRemaining: 0,
        outOfPocketRemaining: 0,
        message: `Service date (${new Date(params.serviceDate).toISOString().slice(0, 10)}) is outside active policy window (${policy.effectiveDate.toISOString().slice(0, 10)} to ${policy.expirationDate.toISOString().slice(0, 10)}).`,
      };
    }

    // Check Member in Family Customer Registry
    const customer = await CustomerModel.findOne({ familyPolicyNumber: params.familyPolicyNumber }).exec();
    let patientInfo: EligibilityResult['patient'] = null;

    if (customer) {
      if (customer.primarySubscriber.memberId === params.patientMemberId) {
        patientInfo = {
          memberId: customer.primarySubscriber.memberId,
          fullName: `${customer.primarySubscriber.firstName} ${customer.primarySubscriber.lastName}`,
          relationship: customer.primarySubscriber.relationship,
        };
      } else {
        const dep = customer.dependents.find((d: any) => d.memberId === params.patientMemberId);
        if (dep) {
          patientInfo = {
            memberId: dep.memberId,
            fullName: `${dep.firstName} ${dep.lastName}`,
            relationship: dep.relationship,
          };
        }
      }
    }

    if (!patientInfo) {
      return {
        isEligible: false,
        policy,
        patient: null,
        categoryBenefit: null,
        deductibleRemaining: 0,
        outOfPocketRemaining: 0,
        message: `Member ID '${params.patientMemberId}' is not enrolled under family policy '${policy.policyNumber}'.`,
      };
    }

    // Check category benefit
    const catBenefit = policy.categoryCoverages.find((c: any) => c.category === params.careCategory);
    const categoryBenefit = catBenefit
      ? {
          category: catBenefit.category,
          copay: catBenefit.copay,
          coinsurancePercentage: catBenefit.coinsurancePercentage,
          requiresPreAuth: catBenefit.requiresPreAuth,
        }
      : null;

    const deductibleRemaining = Math.max(
      0,
      policy.familyFinancials.annualDeductible - policy.familyFinancials.deductibleMetToDate
    );
    const outOfPocketRemaining = Math.max(
      0,
      policy.familyFinancials.outOfPocketMax - policy.familyFinancials.outOfPocketMetToDate
    );

    return {
      isEligible: true,
      policy,
      patient: patientInfo,
      categoryBenefit,
      deductibleRemaining,
      outOfPocketRemaining,
      message: `Active coverage confirmed for ${patientInfo.fullName} under ${policy.planName}.`,
    };
  }

  /**
   * Updates deductible and out-of-pocket accumulator upon settlement
   */
  async updateAccumulators(policyNumber: string, deductibleDelta: number, oopDelta: number): Promise<IPolicy | null> {
    return await PolicyModel.findOneAndUpdate(
      { policyNumber },
      {
        $inc: {
          'familyFinancials.deductibleMetToDate': deductibleDelta,
          'familyFinancials.outOfPocketMetToDate': oopDelta,
        },
      },
      { new: true }
    ).exec();
  }
}

export const policyService = new PolicyService();
