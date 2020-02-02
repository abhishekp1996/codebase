/**
 * @file app
 * @description application start code
 * @created 2020-02-03 00:47:31
 * @author Abhishek Pathak
*/

// resolves all the modules
import 'module-alias/register';

import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";

import routes from "@routes";
import { CONFIG } from "@common";
import { mongoDOA } from "@services";
import Middleware from "@middlewares";

class Application {

    private app: express.Application;

    constructor() {
        this.app = express(); // initialize the express instance
        this.init();
    }

    /** gets the app instance */
    get instance(): express.Application {
        return this.app;
    }

    /** initializes app components */
    async init() {
        mongoDOA.connectDatabase(CONFIG.DB_URI); // connect to database
        this.useMiddlewares(); // use middlewares for requests
        this.useRoutes(); // use routing
    }

    /** uses the middlewares for the app */
    useMiddlewares() {
        this.app.use(cors()); // handles cross origin resouce sharing
        this.app.use(bodyParser.json()); // parses the incoming json requests
        this.app.use(bodyParser.urlencoded({ extended: false })); // parses the incoming query requests
        this.app.use(helmet()); // makes apps more secure
    }

    /** uses the routes for the app */
    useRoutes() {
        this.app.use(routes.path, routes.instance); // uses the in-app routing
        this.app.use(express.static('public')); // serves static files from public directory
        this.app.use(Middleware.InvalidRoute); // invalid route handler
        this.app.use(Middleware.ErrorHandler); // global error handler
    }
}

export default new Application();