/**
 * @file event.entity
 * @description defines event entity methods
 * @created 2020-01-30 23:57:50
*/

import BaseEntity from "./base.entity";
import EventModel from "@models/event.model";

class EventEntity extends BaseEntity {

    constructor(model) {
        super(model);
    }

    /** creates a new event */
    async createEvent(payload) {
        payload.slug = payload.title.toLowerCase().replace(/ /g, "-");
        return new this.model(payload).save();
    }

    /** checks if event exists */
    async checkEventExists(eventId: string) {
        return this.findOne({ _id: eventId });
    }
}

export const Event = new EventEntity(EventModel);