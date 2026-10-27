/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';
import { WorkbasketQueue, UserRole } from '../user/user.model';

export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'PENDING' | 'RESOLVED' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ITask extends Document {
  taskId: string;
  caseId: string;
  stageNumber: number;
  title: string;
  description: string;
  workbasket: WorkbasketQueue;
  assignedRole: UserRole;
  assignedUserId?: string;
  assignedUserName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  slaHours: number;
  slaDeadline: Date;
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    taskId: { type: String, required: true, unique: true, index: true },
    caseId: { type: String, required: true, index: true },
    stageNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    workbasket: {
      type: String,
      required: true,
      index: true,
    },
    assignedRole: {
      type: String,
      required: true,
    },
    assignedUserId: { type: String, default: null },
    assignedUserName: { type: String, default: null },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['OPEN', 'ASSIGNED', 'PENDING', 'RESOLVED', 'COMPLETED'],
      default: 'OPEN',
      index: true,
    },
    slaHours: { type: Number, default: 24 },
    slaDeadline: { type: Date, required: true },
    resolutionNotes: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'tasks',
  }
);

TaskSchema.index({ workbasket: 1, status: 1 });
TaskSchema.index({ caseId: 1, status: 1 });

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);
