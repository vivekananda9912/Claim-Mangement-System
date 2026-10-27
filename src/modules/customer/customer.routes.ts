/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { customerController } from './customer.controller';

const router = Router();

router.post('/', (req, res) => customerController.create(req, res));
router.get('/', (req, res) => customerController.list(req, res));
router.get('/policy/:policyNumber', (req, res) => customerController.getByPolicy(req, res));
router.get('/member/:memberId', (req, res) => customerController.getByMember(req, res));
router.post('/policy/:policyNumber/dependents', (req, res) => customerController.addDependent(req, res));

export const customerRoutes = router;
