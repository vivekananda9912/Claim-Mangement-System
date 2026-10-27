/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { customerService } from './customer.service';

export class CustomerController {
  async create(req: Request, res: Response) {
    try {
      const customer = await customerService.createCustomer(req.body);
      return res.status(201).json({ success: true, data: customer });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getByPolicy(req: Request, res: Response) {
    try {
      const { policyNumber } = req.params;
      const customer = await customerService.getByFamilyPolicyNumber(policyNumber);
      if (!customer) {
        return res.status(404).json({ success: false, error: `Customer for policy '${policyNumber}' not found.` });
      }
      return res.status(200).json({ success: true, data: customer });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getByMember(req: Request, res: Response) {
    try {
      const { memberId } = req.params;
      const result = await customerService.getByMemberId(memberId);
      if (!result) {
        return res.status(404).json({ success: false, error: `Member '${memberId}' not found in any active policy.` });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const customers = await customerService.listAllCustomers();
      return res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async addDependent(req: Request, res: Response) {
    try {
      const { policyNumber } = req.params;
      const updated = await customerService.addDependent(policyNumber, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Policy '${policyNumber}' not found.` });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const customerController = new CustomerController();
