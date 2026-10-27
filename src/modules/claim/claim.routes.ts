/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { claimController } from './claim.controller';

const router = Router();

router.post('/', (req, res) => claimController.create(req, res));
router.post('/check-duplicate', (req, res) => claimController.checkDuplicate(req, res));
router.get('/:claimId', (req, res) => claimController.getById(req, res));
router.put('/:claimId/adjudication', (req, res) => claimController.updateAdjudication(req, res));

export const claimRoutes = router;
