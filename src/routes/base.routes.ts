/**
 * @file base.routes
 * @description defines base router
 * @created 2020-02-01 01:07:09
*/

import { Router } from 'express';

export default class BaseRoute {

    protected router;

    constructor() {
        this.router = Router();
    }

}