/**
 * @file event.model
 * @description defines event model
 * @created 2020-02-01 22:20:37
*/

import { Schema, SchemaTypes, model } from "mongoose";

const participants = new Schema(
    {
        userId: { type: SchemaTypes.ObjectId, required: true },
        joinedAt: { type: SchemaTypes.Date, required: true }
    },
    {
        timestamps: false,
        _id: false,
        versionKey: false
    }
)

const schema = new Schema(
    {
        title: { type: SchemaTypes.String, trim: true, required: true },
        slug: { type: SchemaTypes.String, trim: true, required: true, lowercase: true },
        startDate: { type: SchemaTypes.Date, required: true },
        endDate: { type: SchemaTypes.Date, required: true },
        participants: { type: [participants], default: [] },
        isDelete: { type: SchemaTypes.Boolean, default: false },
        isComplete: { type: SchemaTypes.Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'events'
    }
);

export default model('events', schema);