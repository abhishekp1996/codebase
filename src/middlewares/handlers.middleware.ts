/**
 * @file handler.middleware
 * @description defines handler middleware functions
 * @created 2020-02-01 21:48:31
*/

import { isCelebrate } from "celebrate";
import { Response, Request, NextFunction } from "express";

/** handles node process errors */
export const ErrorHandler = function (err: any, req: Request, res: Response, next: NextFunction) {
    // if error is a validation error, otherwise return server error
    if (isCelebrate(err)) {
        return res.status(400).send({
            success: false,
            statusCode: 400,
            key: err.joi.details[0].context.key,
            message: err.joi.details[0].message.replace(/"/g, '')
        });
    } else if (err.expose) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    } else {
        console.log('ERROR -> ', err);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}

/** handles invalid route message */
export const InvalidRoute = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Invalid route',
        statusCode: 404
    });
}