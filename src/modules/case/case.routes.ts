/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { caseController } from './case.controller';
import { authenticateJWT, requireRole } from '../user/auth.middleware';

export const caseRouter = Router();

caseRouter.use(authenticateJWT);

caseRouter.post('/', (req, res) => caseController.initialize(req, res));
caseRouter.get('/', (req, res) => caseController.list(req, res));
caseRouter.get('/:caseId', (req, res) => caseController.getById(req, res));
caseRouter.post('/:caseId/claim', (req, res) => caseController.intakeClaim(req, res));
caseRouter.put('/:caseId/stage', (req, res) => caseController.advanceStage(req, res));
caseRouter.post(
  '/:caseId/settlement',
  requireRole('PROCESS_OWNER', 'SYSTEM_ADMIN'),
  (req, res) => caseController.disburse(req, res)
);
