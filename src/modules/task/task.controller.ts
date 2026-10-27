/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { taskService } from './task.service';
import { WorkbasketQueue } from '../user/user.model';

export class TaskController {
  public async create(req: Request, res: Response) {
    try {
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const task = await taskService.createTask({
        ...req.body,
        actor,
      });

      return res.status(201).json({ success: true, task });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async assign(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const updated = await taskService.assignTask(taskId, user.userId, user.fullName, actor);
      if (!updated) return res.status(404).json({ success: false, error: 'Task not found' });

      return res.status(200).json({ success: true, task: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async updateStatus(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { status, resolutionNotes } = req.body;
      const user = req.user!;
      const actor = {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        ipAddress: req.ip,
      };

      const updated = await taskService.updateTaskStatus(taskId, status, resolutionNotes || '', actor);
      if (!updated) return res.status(404).json({ success: false, error: 'Task not found' });

      return res.status(200).json({ success: true, task: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async listByWorkbasket(req: Request, res: Response) {
    try {
      const { basket } = req.params;
      const { status } = req.query;
      const tasks = await taskService.getByWorkbasket(basket as WorkbasketQueue, status as any);
      return res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async listByCase(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const tasks = await taskService.getByCaseId(caseId);
      return res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const taskController = new TaskController();
