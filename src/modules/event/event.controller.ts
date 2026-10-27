/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { eventService } from './event.service';

export class EventController {
  public async getTimeline(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const timeline = await eventService.getTimeline(caseId);
      return res.status(200).json({ success: true, count: timeline.length, timeline });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getFiltered(req: Request, res: Response) {
    try {
      const { caseId } = req.params;
      const { stageNumber, eventType } = req.query;
      const filter: any = {};
      if (stageNumber) filter.stageNumber = Number(stageNumber);
      if (eventType) filter.eventType = String(eventType);

      const events = await eventService.getFilteredEvents(caseId, filter);
      return res.status(200).json({ success: true, count: events.length, events });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const eventController = new EventController();
