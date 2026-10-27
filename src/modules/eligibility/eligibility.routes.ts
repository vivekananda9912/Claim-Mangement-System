/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { eligibilityController } from './eligibility.controller';

const router = Router();

/**
 * National Healthcare ID (HCID) Eligibility Service Lookup
 * API: GET /v2/eligibility/subscribers
 */
router.get('/subscribers', (req, res) => eligibilityController.searchSubscribers(req, res));
router.get('/subscribers/:hcid', (req, res) => eligibilityController.getSubscriberByHcid(req, res));

export const eligibilityRoutes = router;
