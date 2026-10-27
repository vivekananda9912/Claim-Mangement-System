/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { taskController } from './task.controller';
import { authenticateJWT, requireWorkbasket } from '../user/auth.middleware';
import { WorkbasketQueue } from '../user/user.model';

export const taskRouter = Router();

taskRouter.use(authenticateJWT);

taskRouter.post('/', (req, res) => taskController.create(req, res));
taskRouter.put('/:taskId/assign', (req, res) => taskController.assign(req, res));
taskRouter.put('/:taskId/status', (req, res) => taskController.updateStatus(req, res));
taskRouter.get('/case/:caseId', (req, res) => taskController.listByCase(req, res));
taskRouter.get('/workbasket/:basket', (req, res) => {
  const basket = req.params.basket as WorkbasketQueue;
  // Dynamic workbasket auth check
  const checker = requireWorkbasket(basket);
  checker(req, res, () => taskController.listByWorkbasket(req, res));
});
