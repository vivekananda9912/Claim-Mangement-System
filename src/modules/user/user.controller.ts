/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { userService } from './user.service';

export class UserController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required.' });
      }

      const result = await userService.validateLogin(username, password);
      if (!result) {
        return res.status(401).json({ success: false, error: 'Invalid username or password, or account suspended.' });
      }

      return res.status(200).json({
        success: true,
        data: {
          token: result.token,
          user: {
            userId: result.user.userId,
            username: result.user.username,
            fullName: result.user.fullName,
            role: result.user.role,
            department: result.user.department,
            authorizedWorkbaskets: result.user.authorizedWorkbaskets,
            doctorProfileId: result.user.doctorProfileId,
          },
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthenticated' });
      }
      return res.status(200).json({ success: true, data: req.user });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await userService.listAllUsers();
      return res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const userController = new UserController();
