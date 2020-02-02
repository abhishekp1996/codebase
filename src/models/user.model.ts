/**
 * @file user.model
 * @description defines user model
 * @created 2020-01-30 23:52:06
*/

import { Schema, SchemaTypes, model } from "mongoose";

const schema = new Schema(
    {
        name: { type: SchemaTypes.String, required: true },
        username: { type: SchemaTypes.String, trim: true, required: true },
        isDelete: { type: SchemaTypes.Boolean, default: false },
        score: { type: SchemaTypes.Number, default: 0 }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'users'
    }
);

export default model('users', schema);