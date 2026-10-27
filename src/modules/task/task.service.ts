/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskModel, ITask, TaskStatus, TaskPriority } from './task.model';
import { WorkbasketQueue, UserRole } from '../user/user.model';
import { eventService } from '../event/event.service';
import { ICaseActor } from '../event/event.model';

export class TaskService {
  /**
   * Spawns a new task assigned to an operational workbasket
   */
  public async createTask(params: {
    caseId: string;
    stageNumber: number;
    title: string;
    description: string;
    workbasket: WorkbasketQueue;
    assignedRole: UserRole;
    priority?: TaskPriority;
    slaHours?: number;
    actor: ICaseActor;
  }): Promise<ITask> {
    const taskId = `TSK-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const slaHours = params.slaHours || 24;
    const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000);

    const task = new TaskModel({
      taskId,
      caseId: params.caseId,
      stageNumber: params.stageNumber,
      title: params.title,
      description: params.description,
      workbasket: params.workbasket,
      assignedRole: params.assignedRole,
      priority: params.priority || 'MEDIUM',
      status: 'OPEN',
      slaHours,
      slaDeadline,
    });

    const saved = await task.save();

    await eventService.appendEvent(
      params.caseId,
      'TASK_SPAWNED',
      params.stageNumber,
      params.actor,
      { taskId, workbasket: params.workbasket, title: params.title, priority: task.priority }
    );

    return saved;
  }

  /**
   * Assigns task to a specific authenticated user
   */
  public async assignTask(taskId: string, userId: string, userName: string, actor: ICaseActor): Promise<ITask | null> {
    const task = await TaskModel.findOne({ taskId }).exec();
    if (!task) return null;

    task.assignedUserId = userId;
    task.assignedUserName = userName;
    task.status = 'ASSIGNED';
    const updated = await task.save();

    await eventService.appendEvent(
      task.caseId,
      'TASK_ASSIGNED',
      task.stageNumber,
      actor,
      { taskId, assignedUserId: userId, assignedUserName: userName }
    );

    return updated;
  }

  /**
   * Updates task status (e.g. RESOLVED, COMPLETED, PENDING)
   */
  public async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    resolutionNotes: string,
    actor: ICaseActor
  ): Promise<ITask | null> {
    const task = await TaskModel.findOne({ taskId }).exec();
    if (!task) return null;

    task.status = status;
    task.resolutionNotes = resolutionNotes;
    if (status === 'RESOLVED' || status === 'COMPLETED') {
      task.resolvedAt = new Date();
      task.resolvedBy = actor.fullName;
    }

    const updated = await task.save();

    await eventService.appendEvent(
      task.caseId,
      'TASK_COMPLETED',
      task.stageNumber,
      actor,
      { taskId, status, resolutionNotes }
    );

    return updated;
  }

  /**
   * Fetches open/assigned tasks by workbasket queue
   */
  public async getByWorkbasket(workbasket: WorkbasketQueue, status?: TaskStatus): Promise<ITask[]> {
    const query: any = { workbasket };
    if (status) query.status = status;
    return await TaskModel.find(query).sort({ priority: -1, slaDeadline: 1 }).exec();
  }

  /**
   * Fetches tasks linked to a specific Case
   */
  public async getByCaseId(caseId: string): Promise<ITask[]> {
    return await TaskModel.find({ caseId }).sort({ createdAt: -1 }).exec();
  }
}

export const taskService = new TaskService();
