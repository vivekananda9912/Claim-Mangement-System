/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { eligibilityService } from './eligibility.service';

export class EligibilityController {
  /**
   * National Healthcare ID (HCID) Eligibility Service Lookup
   * GET /v2/eligibility/subscribers
   */
  async searchSubscribers(req: Request, res: Response) {
    try {
      const { hcid, query, q, policyNumber, relationship, limit } = req.query;

      const result = await eligibilityService.searchSubscribers({
        hcid: typeof hcid === 'string' ? hcid : undefined,
        query: typeof query === 'string' ? query : typeof q === 'string' ? q : undefined,
        policyNumber: typeof policyNumber === 'string' ? policyNumber : undefined,
        relationship: typeof relationship === 'string' ? relationship : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `HCID Eligibility Lookup Service Error: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * National Healthcare ID (HCID) Single Subscriber Record
   * GET /v2/eligibility/subscribers/:hcid
   */
  async getSubscriberByHcid(req: Request, res: Response) {
    try {
      const { hcid } = req.params;
      const subscriber = await eligibilityService.getSubscriberByHcid(hcid);

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          error: `Subscriber with National Healthcare ID '${hcid}' not found in registry.`,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        data: subscriber,
        metadata: {
          clearinghouse: 'National Healthcare Identifier Clearinghouse (NHIC)',
          serviceEndpoint: `/v2/eligibility/subscribers/${hcid}`,
          queryTimestamp: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: `HCID Eligibility Lookup Service Error: ${err.message}`,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const eligibilityController = new EligibilityController();
