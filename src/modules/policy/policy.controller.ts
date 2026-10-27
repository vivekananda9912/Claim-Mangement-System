/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { policyService } from './policy.service';

export class PolicyController {
  async create(req: Request, res: Response) {
    try {
      const policy = await policyService.createPolicy(req.body);
      return res.status(201).json({ success: true, data: policy });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getByNumber(req: Request, res: Response) {
    try {
      const { policyNumber } = req.params;
      const policy = await policyService.getByPolicyNumber(policyNumber);
      if (!policy) {
        return res.status(404).json({ success: false, error: `Policy '${policyNumber}' not found.` });
      }
      return res.status(200).json({ success: true, data: policy });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const policies = await policyService.listAllPolicies();
      return res.status(200).json({ success: true, count: policies.length, data: policies });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async verifyEligibility(req: Request, res: Response) {
    try {
      const { familyPolicyNumber, patientMemberId, careCategory, serviceDate } = req.body;
      if (!familyPolicyNumber || !patientMemberId || !careCategory || !serviceDate) {
        return res.status(400).json({
          success: false,
          error: 'familyPolicyNumber, patientMemberId, careCategory, and serviceDate are required fields.',
        });
      }

      const result = await policyService.verifyEligibility({
        familyPolicyNumber,
        patientMemberId,
        careCategory,
        serviceDate: new Date(serviceDate),
      });

      return res.status(result.isEligible ? 200 : 400).json({
        success: result.isEligible,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const policyController = new PolicyController();
