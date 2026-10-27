/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { evidenceController } from './evidence.controller';
import { authenticateJWT, requireRole } from '../user/auth.middleware';

export const evidenceRouter = Router();

evidenceRouter.use(authenticateJWT);

evidenceRouter.post('/mint', (req, res) => evidenceController.mint(req, res));
evidenceRouter.put(
  '/:dcn/verify',
  requireRole('OPERATIONS_ANALYST', 'SYSTEM_ADMIN', 'PROCESS_OWNER', 'DOCTOR_APPROVER'),
  (req, res) => evidenceController.verify(req, res)
);
evidenceRouter.get('/case/:caseId', (req, res) => evidenceController.listByCase(req, res));
evidenceRouter.get('/:dcn', (req, res) => evidenceController.getByDcn(req, res));
