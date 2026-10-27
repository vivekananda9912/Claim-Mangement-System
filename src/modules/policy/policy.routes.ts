/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { policyController } from './policy.controller';

const router = Router();

router.post('/', (req, res) => policyController.create(req, res));
router.get('/', (req, res) => policyController.list(req, res));
router.get('/:policyNumber', (req, res) => policyController.getByNumber(req, res));
router.post('/verify-eligibility', (req, res) => policyController.verifyEligibility(req, res));

export const policyRoutes = router;
