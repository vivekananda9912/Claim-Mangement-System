/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { fraudService } from './fraud.service';

export class FraudController {
  public async evaluate(req: Request, res: Response) {
    try {
      const { caseId, claimId } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const assessment = await fraudService.evaluateClaim(caseId, claimId, actor);
      return res.status(200).json({ success: true, assessment });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async clear(req: Request, res: Response) {
    try {
      const { assessmentId } = req.params;
      const { notes } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const assessment = await fraudService.clearFraudHold(assessmentId, notes || 'Hold cleared after audit', actor);
      if (!assessment) return res.status(404).json({ success: false, error: 'Assessment not found' });

      return res.status(200).json({ success: true, assessment });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async listByCase(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const assessments = await fraudService.getByCaseId(caseId);
      return res.status(200).json({ success: true, count: assessments.length, assessments });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const fraudController = new FraudController();
