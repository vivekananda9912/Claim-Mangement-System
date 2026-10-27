/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './user.service';
import { UserRole, WorkbasketQueue } from './user.model';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'omniclaim_production_secret_key_2026';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required. Missing or malformed Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(403).json({ success: false, error: 'Invalid, expired, or tampered token.' });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Role '${req.user?.role}' is not authorized for this operation.`,
      });
    }
    next();
  };
}

export function requireWorkbasket(basketName: WorkbasketQueue) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    const hasAccess =
      req.user.authorizedWorkbaskets.includes(basketName) ||
      req.user.authorizedWorkbaskets.includes('ALL_WORKBASKETS');

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: User is not authorized to pull from '${basketName}' workbasket.`,
      });
    }
    next();
  };
}
