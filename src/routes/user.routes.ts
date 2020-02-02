/**
 * @file user.routes
 * @description defines routing for user routes
 * @created 2020-02-01 01:08:43
*/

import { celebrate } from "celebrate";
import { Router } from "express";

import BaseRoute from "@baseRoute";
import { VALIDATION } from "@common";
import { UserController } from "@controllers";

class UserRouteClass extends BaseRoute {

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

        /** registers a new user */
        this.router.post('/',
            celebrate({
                body: {
                    name: VALIDATION.USER.NAME.required(),
                    username: VALIDATION.USER.USERNAME.required()
                }
            }),
            (req, res, next) => {
                UserController.registerUser(req, res, next);
            }
        );

        /** registers a new user */
        this.router.patch('/:userId',
            celebrate({
                params: { userId: VALIDATION.GENERAL.MONGOID },
                body: {
                    name: VALIDATION.USER.NAME.required(),
                    username: VALIDATION.USER.USERNAME.required()
                }
            }),
            (req, res, next) => {
                UserController.updateUser(req, res, next);
            }
        );

        /** registers a new user */
        this.router.post('/:userId/register/:eventId',
            celebrate({
                params: {
                    userId: VALIDATION.GENERAL.MONGOID,
                    eventId: VALIDATION.GENERAL.MONGOID,
                }
            }),
            (req, res, next) => {
                UserController.eventRegister(req, res, next);
            }
        );
    }
}

export default new UserRouteClass('/users');