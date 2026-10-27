/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { doctorController } from './doctor.controller';
import { authenticateJWT, requireRole } from '../user/auth.middleware';

export const doctorRouter = Router();

doctorRouter.use(authenticateJWT);

doctorRouter.get('/', (req, res) => doctorController.list(req, res));
doctorRouter.get('/:profileId', (req, res) => doctorController.getProfile(req, res));
doctorRouter.post(
  '/adjudicate',
  requireRole('DOCTOR_APPROVER', 'SYSTEM_ADMIN'),
  (req, res) => doctorController.adjudicate(req, res)
);
