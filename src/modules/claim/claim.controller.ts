/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { claimService } from './claim.service';

export class ClaimController {
  async create(req: Request, res: Response) {
    try {
      const claim = await claimService.createClaim(req.body);
      return res.status(201).json({ success: true, data: claim });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { claimId } = req.params;
      const claim = await claimService.getByClaimId(claimId);
      if (!claim) {
        return res.status(404).json({ success: false, error: `Claim '${claimId}' not found.` });
      }
      return res.status(200).json({ success: true, data: claim });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async checkDuplicate(req: Request, res: Response) {
    try {
      const { claimId, npi, memberId, serviceStartDate, totalBilledAmount } = req.body;
      if (!claimId || !npi || !memberId || !serviceStartDate || totalBilledAmount === undefined) {
        return res.status(400).json({
          success: false,
          error: 'claimId, npi, memberId, serviceStartDate, and totalBilledAmount are required for duplicate checking.',
        });
      }

      const result = await claimService.checkDuplicate({
        claimId,
        npi,
        memberId,
        serviceStartDate: new Date(serviceStartDate),
        totalBilledAmount: Number(totalBilledAmount),
      });

      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async updateAdjudication(req: Request, res: Response) {
    try {
      const { claimId } = req.params;
      const { adjustments } = req.body;
      const updated = await claimService.updateLineDecisions(claimId, adjustments);
      if (!updated) {
        return res.status(404).json({ success: false, error: `Claim '${claimId}' not found.` });
      }
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const claimController = new ClaimController();
