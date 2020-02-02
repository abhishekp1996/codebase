/**
 * @file common/validations
 * @description exposes all the validation objects
 * @created 2020-02-01 22:33:14
*/

import { Joi } from "celebrate";

export const VALIDATION = {
    EVENT: {
        TITLE: Joi.string().trim(),
        START_DATE: Joi.date().iso(),
        END_DATE: Joi.date().iso().greater(Joi.ref('startDate')),
    },
    GENERAL: {
        ANY: Joi.any(),
        BOOLEAN: Joi.boolean(),
        STRING: Joi.string(),
        PAGINATION: {
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(3).max(100).default(10).optional(),
            search: Joi.string().trim().optional(),
            createdFrom: Joi.date().iso(),
            createdTo: Joi.date().iso()
        },
        NUMBER: Joi.number(),
        MONGOID: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        REF: (key: string) => Joi.ref(key)
    },
    USER: {
        NAME: Joi.string().trim(),
        USERNAME: Joi.string().trim()
    }
}