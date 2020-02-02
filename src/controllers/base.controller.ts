/**
 * @file base.controller
 * @description defines base controller methods
 * @created 2020-02-01 23:14:36
*/

export default class BaseClass {

    constructor() { }

    /** dispatches response from the server */
    async sendResponse(r, b, d = {}) {
        b.data = d;
        r.status(b.httpCode).json(b);
    }

    /** sends error response after printing on console */
    async errorResponse(res, err) {
        console.log("ERROR : ", err);
        res.status(400).send({ success: false, message: err.message || err, statusCode: 400 });
    }
}