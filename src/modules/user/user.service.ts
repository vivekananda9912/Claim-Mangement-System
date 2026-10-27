/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser, UserRole, WorkbasketQueue } from './user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'omniclaim_production_secret_key_2026';

export interface TokenPayload {
  sub: string;
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
  department: string;
  authorizedWorkbaskets: WorkbasketQueue[];
  doctorProfileId?: string;
}

export class UserService {
  async createUser(data: {
    userId: string;
    username: string;
    password: string;
    fullName: string;
    role: UserRole;
    department: string;
    authorizedWorkbaskets: WorkbasketQueue[];
    doctorProfileId?: string;
  }): Promise<IUser> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = new UserModel({
      userId: data.userId,
      username: data.username,
      passwordHash,
      fullName: data.fullName,
      role: data.role,
      department: data.department,
      authorizedWorkbaskets: data.authorizedWorkbaskets,
      doctorProfileId: data.doctorProfileId,
    });

    return await user.save();
  }

  async validateLogin(username: string, password: string): Promise<{ token: string; user: IUser } | null> {
    const user = await UserModel.findOne({
      username: username.toLowerCase().trim(),
      status: 'ACTIVE',
    }).exec();

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    const payload: TokenPayload = {
      sub: user._id.toString(),
      userId: user.userId,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      authorizedWorkbaskets: user.authorizedWorkbaskets,
      doctorProfileId: user.doctorProfileId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    return { token, user };
  }

  // Alias for authenticate
  async authenticate(username: string, password: string) {
    return this.validateLogin(username, password);
  }

  async getByUserId(userId: string): Promise<IUser | null> {
    return await UserModel.findOne({ userId }).exec();
  }

  async listAllUsers(): Promise<IUser[]> {
    return await UserModel.find().sort({ role: 1 }).exec();
  }

  /**
   * Seeds the 5 default enterprise user accounts if not present
   */
  async seedDefaultUsers(): Promise<void> {
    const seedUsers = [
      {
        userId: 'usr_requester_01',
        username: 'requester@omniclaim.internal',
        password: 'RequesterPass2026!',
        fullName: 'David Miller (Metropolitan Billing)',
        role: 'BUSINESS_REQUESTER' as UserRole,
        department: 'Revenue Cycle & Submissions',
        authorizedWorkbaskets: ['INTAKE'] as WorkbasketQueue[],
      },
      {
        userId: 'usr_intake_02',
        username: 'process.owner@omniclaim.internal',
        password: 'ProcessOwner2026!',
        fullName: 'Amanda Vance, CPC',
        role: 'PROCESS_OWNER' as UserRole,
        department: 'Claims Operations & Triage',
        authorizedWorkbaskets: ['INTAKE', 'EVIDENCE_DEFICIENCY', 'SETTLEMENT'] as WorkbasketQueue[],
      },
      {
        userId: 'usr_dr_chen',
        username: 'doctor.chen@omniclaim.internal',
        password: 'DoctorChen2026!',
        fullName: 'Dr. Sarah Chen, MD',
        role: 'DOCTOR_APPROVER' as UserRole,
        department: 'Clinical Review & Utilization',
        authorizedWorkbaskets: ['CLINICAL_REVIEW', 'SETTLEMENT'] as WorkbasketQueue[],
        doctorProfileId: 'DOC-PROF-9921',
      },
      {
        userId: 'usr_analyst_01',
        username: 'analyst@omniclaim.internal',
        password: 'AnalystPass2026!',
        fullName: 'Marcus Brody, CFE',
        role: 'OPERATIONS_ANALYST' as UserRole,
        department: 'Special Investigations Unit (SIU)',
        authorizedWorkbaskets: ['FRAUD_SIU'] as WorkbasketQueue[],
      },
      {
        userId: 'usr_admin_01',
        username: 'admin@omniclaim.internal',
        password: 'AdminSuper2026!',
        fullName: 'Elena Rostova (Enterprise Architect)',
        role: 'SYSTEM_ADMIN' as UserRole,
        department: 'Core Infrastructure',
        authorizedWorkbaskets: ['ALL_WORKBASKETS'] as WorkbasketQueue[],
      },
    ];

    for (const u of seedUsers) {
      const exists = await UserModel.findOne({ username: u.username }).exec();
      if (!exists) {
        await this.createUser(u);
        console.log(`[Seed User] Created default user: ${u.username}`);
      }
    }
  }
}

export const userService = new UserService();
