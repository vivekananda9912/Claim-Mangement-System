/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { userController } from './user.controller';
import { authenticateJWT, requireRole } from './auth.middleware';

const router = Router();

router.post('/login', (req, res) => userController.login(req, res));
router.get('/me', authenticateJWT, (req, res) => userController.getMe(req, res));
router.get('/users', authenticateJWT, requireRole('SYSTEM_ADMIN'), (req, res) => userController.list(req, res));

export const userRoutes = router;
