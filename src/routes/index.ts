/**
 * @file routes/index
 * @description exposes routing paths
 * @created 2020-02-03 00:47:46
 * @author Abhishek Pathak
*/

import { Router } from "express";

import BaseRoute from "./base.routes";
import UserRoute from "./user.routes";
import AdminRoute from "./admin.routes";

class Routes extends BaseRoute {

    public path = '/api';

    constructor() {
        super();
        this.init();
    }

    get instance(): Router {
        return this.router;
    }

    /** initializes routes */
    private init() {
        this.router.use(UserRoute.path, UserRoute.instance);
        this.router.use(AdminRoute.path, AdminRoute.instance);
    }
}

export default new Routes();