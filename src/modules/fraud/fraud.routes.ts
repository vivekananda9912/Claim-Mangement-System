/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { fraudController } from './fraud.controller';
import { authenticateJWT, requireRole } from '../user/auth.middleware';

export const fraudRouter = Router();

fraudRouter.use(authenticateJWT);

fraudRouter.post('/evaluate', (req, res) => fraudController.evaluate(req, res));
fraudRouter.put(
  '/:assessmentId/clear',
  requireRole('OPERATIONS_ANALYST', 'SYSTEM_ADMIN', 'PROCESS_OWNER'),
  (req, res) => fraudController.clear(req, res)
);
fraudRouter.get('/case/:caseId', (req, res) => fraudController.listByCase(req, res));
