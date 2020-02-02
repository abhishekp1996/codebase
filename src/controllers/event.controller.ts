/**
 * @file event.controller
 * @description defines common event methods
 * @created 2020-02-01 21:44:07
*/

import { Event } from "@entity";
import { RESPONSE } from "@common";
import BaseClass from "@baseController";
import * as Builder from "@builders";

class EventClass extends BaseClass {

    constructor() {
        super();
    }

    /**
     * @method post
     * @description creates a new event
     */
    async createEvent(req, res, next) {
        try {
            let payload = req.body,
                createdEvent = await Event.createEvent(payload);
            this.sendResponse(res, RESPONSE.SUCCESS, createdEvent);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @method get
     * @description gets the event details
     */
    async getEvent(req, res, next) {
        try {
            let eventId = req.params.eventId,
                eventDataPipeline = Builder.EventDetail(eventId),
                eventData = await Event.basicAggregate(eventDataPipeline);
            if (eventData.length) {
                this.sendResponse(res, RESPONSE.SUCCESS, eventData[0]);
            } else this.sendResponse(res, RESPONSE.EVENT.EVENT_NOT_FOUND);
        } catch (err) {
            next(err);
        }
    }
}

export const EventController = new EventClass();