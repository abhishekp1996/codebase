/**
 * @file admin.routes
 * @description defines routing for admin routes
 * @created 2020-02-01 01:08:43
*/

import { celebrate } from "celebrate";
import { Router } from "express";

import BaseRoute from "@baseRoute";
import { VALIDATION } from "@common";
import { EventController, UserController } from "@controllers";

class AdminRouteClass extends BaseRoute {

    public path: string;

    constructor(path: string) {
        super();
        this.path = path;
        this.initRoutes();
    }

    get instance(): Router {
        return this.router;
    }

    initRoutes() {

        /** creates new event */
        this.router.get('/users',
            celebrate({
                query: VALIDATION.GENERAL.PAGINATION
            }),
            (req, res, next) => {
                UserController.usersList(req, res, next);
            }
        );

        /** deletes the user */
        this.router.delete('/users/:userId',
            celebrate({
                params: { userId: VALIDATION.GENERAL.MONGOID }
            }),
            (req, res, next) => {
                UserController.deleteUser(req, res, next);
            }
        );

        /** creates new event */
        this.router.post('/events',
            celebrate({
                body: {
                    title: VALIDATION.EVENT.TITLE.required(),
                    startDate: VALIDATION.EVENT.START_DATE.required(),
                    endDate: VALIDATION.EVENT.END_DATE.required()
                }
            }),
            (req, res, next) => {
                EventController.createEvent(req, res, next);
            }
        );

        /** creates new event */
        this.router.get('/events/:eventId',
            celebrate({
                params: { eventId: VALIDATION.GENERAL.MONGOID }
            }),
            (req, res, next) => {
                EventController.getEvent(req, res, next);
            }
        );
    }
}

export default new AdminRouteClass('/admin');