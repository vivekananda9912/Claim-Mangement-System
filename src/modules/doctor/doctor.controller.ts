/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { doctorService } from './doctor.service';

export class DoctorController {
  public async list(req: Request, res: Response) {
    try {
      const doctors = await doctorService.listDoctors();
      return res.status(200).json({ success: true, count: doctors.length, doctors });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      const { profileId } = req.params;
      const doctor = await doctorService.getDoctorProfile(profileId);
      if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });
      return res.status(200).json({ success: true, doctor });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async adjudicate(req: Request, res: Response) {
    try {
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const result = await doctorService.submitClinicalReview({
        ...req.body,
        actor,
      });

      return res.status(200).json({ success: true, adjudication: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

export const doctorController = new DoctorController();
