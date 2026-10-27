/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { eventController } from './event.controller';
import { authenticateJWT } from '../user/auth.middleware';

export const eventRouter = Router();

eventRouter.use(authenticateJWT);

eventRouter.get('/cases/:caseId/timeline', (req, res) => eventController.getTimeline(req, res));
eventRouter.get('/cases/:caseId/filter', (req, res) => eventController.getFiltered(req, res));
