/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CustomerModel, ICustomer, IFamilyMember } from './customer.model';

export class CustomerService {
  /**
   * Creates a new family customer record
   */
  async createCustomer(data: Partial<ICustomer>): Promise<ICustomer> {
    const customer = new CustomerModel(data);
    return await customer.save();
  }

  /**
   * Retrieves a customer by family policy number
   */
  async getByFamilyPolicyNumber(familyPolicyNumber: string): Promise<ICustomer | null> {
    return await CustomerModel.findOne({ familyPolicyNumber }).exec();
  }

  /**
   * Finds a customer containing a specific member ID (subscriber or dependent)
   */
  async getByMemberId(memberId: string): Promise<{ customer: ICustomer; member: IFamilyMember } | null> {
    const customer = await CustomerModel.findOne({
      $or: [
        { 'primarySubscriber.memberId': memberId },
        { 'dependents.memberId': memberId },
      ],
    }).exec();

    if (!customer) return null;

    if (customer.primarySubscriber.memberId === memberId) {
      return { customer, member: customer.primarySubscriber };
    }

    const dependent = customer.dependents.find((d: any) => d.memberId === memberId);
    if (dependent) {
      return { customer, member: dependent };
    }

    return null;
  }

  /**
   * Lists all customers
   */
  async listAllCustomers(): Promise<ICustomer[]> {
    return await CustomerModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Adds a covered dependent to an existing family policy
   */
  async addDependent(familyPolicyNumber: string, dependent: IFamilyMember): Promise<ICustomer | null> {
    return await CustomerModel.findOneAndUpdate(
      { familyPolicyNumber },
      { $push: { dependents: dependent } },
      { new: true }
    ).exec();
  }
}

export const customerService = new CustomerService();
