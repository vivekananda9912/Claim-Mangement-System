/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { evidenceService } from './evidence.service';

export class EvidenceController {
  public async mint(req: Request, res: Response) {
    try {
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const evidence = await evidenceService.mintEvidence({
        ...req.body,
        actor,
      });

      return res.status(201).json({ success: true, evidence });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async verify(req: Request, res: Response) {
    try {
      const { dcn } = req.params;
      const { verificationStatus, isLegible, rejectionReason } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const updated = await evidenceService.verifyEvidence(
        dcn,
        verificationStatus,
        isLegible !== undefined ? isLegible : true,
        rejectionReason,
        actor
      );

      if (!updated) return res.status(404).json({ success: false, error: 'Evidence record not found' });

      return res.status(200).json({ success: true, evidence: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async listByCase(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const evidences = await evidenceService.getByCaseId(caseId);
      return res.status(200).json({ success: true, count: evidences.length, evidences });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getByDcn(req: Request, res: Response) {
    try {
      const { dcn } = req.params;
      const evidence = await evidenceService.getByDcn(dcn);
      if (!evidence) return res.status(404).json({ success: false, error: 'Evidence not found' });

      return res.status(200).json({ success: true, evidence });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const evidenceController = new EvidenceController();
