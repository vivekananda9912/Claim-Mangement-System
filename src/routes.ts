/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from 'express';
import { userRoutes } from './modules/user/user.routes';
import { customerRoutes } from './modules/customer/customer.routes';
import { policyRoutes } from './modules/policy/policy.routes';
import { claimRoutes } from './modules/claim/claim.routes';
import { caseRouter } from './modules/case/case.routes';
import { taskRouter } from './modules/task/task.routes';
import { evidenceRouter } from './modules/evidence/evidence.routes';
import { doctorRouter } from './modules/doctor/doctor.routes';
import { fraudRouter } from './modules/fraud/fraud.routes';
import { eventRouter } from './modules/event/event.routes';
import { eligibilityRoutes } from './modules/eligibility/eligibility.routes';

export const apiRouter = Router();

// Health check route
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'OmniClaim Health Enterprise Orchestration Engine',
    timestamp: new Date().toISOString(),
    stagesSupported: [
      'Stage 1: Policy & Family Eligibility',
      'Stage 2: Claim Intake & Duplicate Check',
      'Stage 3: Evidence & DCN Audit',
      'Stage 4: Clinical & Fraud Adjudication',
      'Stage 5: Settlement & Disbursement',
      'Stage 6: Closed & Archived',
    ],
  });
});

// Domain Routes
apiRouter.use('/auth', userRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/policies', policyRoutes);
apiRouter.use('/claims', claimRoutes);
apiRouter.use('/cases', caseRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/evidences', evidenceRouter);
apiRouter.use('/doctors', doctorRouter);
apiRouter.use('/fraud', fraudRouter);
apiRouter.use('/events', eventRouter);
apiRouter.use('/v2/eligibility', eligibilityRoutes);
apiRouter.use('/eligibility', eligibilityRoutes);
