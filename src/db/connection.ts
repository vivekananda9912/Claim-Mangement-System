/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { enableInMemoryMongooseFallback } from './inMemoryAdapter';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDatabase(): Promise<typeof mongoose | null> {
  // If already connected to real MongoDB, return
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If MONGODB_URI is provided in environment, attempt real MongoDB connection
  if (MONGODB_URI) {
    try {
      const conn = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        autoIndex: true,
      });
      console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
      return conn;
    } catch (err: any) {
      console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${MONGODB_URI}: ${err.message}`);
    }
  }

  // In sandbox or when no MongoDB instance is reachable, activate in-memory MongoDB compatibility engine
  enableInMemoryMongooseFallback();
  return null;
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected.');
  }
}
