/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { caseService } from './case.service';

export class CaseController {
  public async initialize(req: Request, res: Response) {
    try {
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const result = await caseService.initializeCase({
        ...req.body,
        incidentDate: new Date(req.body.incidentDate),
        actor,
      });

      return res.status(201).json({ success: true, case: result.caseRecord, eligibility: result.eligibilityResult });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async intakeClaim(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const result = await caseService.intakeClaim(caseId, req.body, actor);
      return res.status(200).json({ success: true, case: result.caseRecord, claim: result.claim });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async advanceStage(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const { targetStage } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const updated = await caseService.advanceStage(caseId, Number(targetStage), actor);
      return res.status(200).json({ success: true, case: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async disburse(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const { paymentMethod, checkNumberOrEft } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const updated = await caseService.disburseSettlement(caseId, paymentMethod, checkNumberOrEft, actor);
      return res.status(200).json({ success: true, case: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const caseRecord = await caseService.getCaseById(caseId);
      if (!caseRecord) return res.status(404).json({ success: false, error: 'Case not found' });
      return res.status(200).json({ success: true, case: caseRecord });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      const { stage, status, careLine } = req.query;
      const filter: any = {};
      if (stage) filter.stage = Number(stage);
      if (status) filter.status = String(status);
      if (careLine) filter.careLine = String(careLine);

      const cases = await caseService.listCases(filter);
      return res.status(200).json({ success: true, count: cases.length, cases });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const caseController = new CaseController();
