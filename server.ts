/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/routes';
import { eligibilityRoutes } from './src/modules/eligibility/eligibility.routes';
import { connectDatabase } from './src/db/connection';
import { seedDatabase } from './src/db/seed';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Connect Database & Seed initial master records
  await connectDatabase();
  await seedDatabase();

  // Mount National Healthcare ID (HCID) Eligibility Service Lookup
  app.use('/v2/eligibility', eligibilityRoutes);

  // Mount OmniClaim REST API routes
  app.use('/api', apiRouter);

  // In development mode, mount Vite middleware for React SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniClaim Enterprise Server] Running at http://localhost:${PORT}`);
    console.log(`[OmniClaim API] REST endpoints available at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('[OmniClaim Server] Failed to start:', err);
  process.exit(1);
});
