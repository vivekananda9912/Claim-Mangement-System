/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseEventModel, ICaseEvent, CaseEventType, ICaseActor } from './event.model';

export class EventService {
  /**
   * Appends an immutable event to the case log with an atomic sequence number increment.
   */
  public async appendEvent(
    caseId: string,
    eventType: CaseEventType,
    stageNumber: number,
    actor: ICaseActor,
    payload: Record<string, any> = {},
    correlationId?: string
  ): Promise<ICaseEvent> {
    // Find highest sequence number for this case
    const lastEvent = await CaseEventModel.findOne({ caseId }).sort({ sequenceNumber: -1 }).exec();
    const nextSeq = lastEvent ? lastEvent.sequenceNumber + 1 : 1;

    const event = new CaseEventModel({
      caseId,
      sequenceNumber: nextSeq,
      eventType,
      stageNumber,
      actor,
      payload,
      correlationId: correlationId || `CORR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    });

    return await event.save();
  }

  /**
   * Returns complete chronological audit trail of all events for a case
   */
  public async getTimeline(caseId: string): Promise<ICaseEvent[]> {
    return await CaseEventModel.find({ caseId }).sort({ sequenceNumber: 1 }).exec();
  }

  /**
   * Filter events by type or stage
   */
  public async getFilteredEvents(
    caseId: string,
    filter: { stageNumber?: number; eventType?: string }
  ): Promise<ICaseEvent[]> {
    const query: any = { caseId };
    if (filter.stageNumber !== undefined) query.stageNumber = filter.stageNumber;
    if (filter.eventType) query.eventType = filter.eventType;
    return await CaseEventModel.find(query).sort({ sequenceNumber: 1 }).exec();
  }
}

export const eventService = new EventService();
