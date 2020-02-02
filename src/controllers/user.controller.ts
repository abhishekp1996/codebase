/**
 * @file user.controller
 * @description defines user controller methods
 * @created 2020-02-01 21:44:07
*/

import { RESPONSE } from "@common";
import { SocketIO } from "@services";
import * as Builder from "@builders";
import { User, Event } from "@entity";
import BaseClass from "@baseController";

class UserClass extends BaseClass {

    constructor() {
        super();
    }

    /**
     * @method post
     * @description registers a new user
     */
    async registerUser(req, res, next) {
        try {
            let payload = req.body,
                checkUsernameExists = await User.checkUsernameExists(payload.username);
            if (!checkUsernameExists) {
                let createdUser = await User.createUser(payload);
                this.sendResponse(res, RESPONSE.SUCCESS, createdUser);
            } else this.sendResponse(res, RESPONSE.USER.USERNAME_EXISTS);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @method patch
     * @description updates the details of the user
     */
    async updateUser(req, res, next) {
        try {
            let payload = req.body,
                checkUserExists = await User.checkUserExists(req.params.userId);
            if (checkUserExists) {
                // check if username is also being updated
                if (payload.username) {
                    let checkUsernameExists = await User.checkUsernameExists(payload.username);
                    if (checkUsernameExists) return this.sendResponse(res, RESPONSE.USER.USERNAME_EXISTS);
                }
                let updatedUser = await User.updateEntity({ _id: checkUserExists._id }, payload);
                this.sendResponse(res, RESPONSE.SUCCESS, updatedUser.data);
            } else this.sendResponse(res, RESPONSE.USER.USER_NOT_FOUND);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @method get
     * @description gets the list of users
     */
    async usersList(req, res, next) {
        try {
            let payload = req.query,
                usersListPipeline = await Builder.UsersList(payload);

            // send response with total count
            payload.getCount = true;
            let usersList = await User.paginateAggregate(usersListPipeline, payload);

            this.sendResponse(res, RESPONSE.SUCCESS, usersList);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @method delete
     * @description deletes the user
     */
    async deleteUser(req, res, next) {
        try {
            let userId = req.params.userId,
                checkUserExists = await User.checkUserExists(userId);
            if (checkUserExists) {
                await User.deleteUser(userId); // deletes the user (changes isDelete status)
                this.sendResponse(res, RESPONSE.SUCCESS);
            } else this.sendResponse(res, RESPONSE.USER.USER_NOT_FOUND);
        } catch (err) {
            next(err);
        }
    }

    /**
     * @method post
     * @description registers user for event
     */
    async eventRegister(req, res, next) {
        try {
            let userId = req.params.userId,
                eventId = req.params.eventId;
            let [userExists, eventExists] = await Promise.all([
                User.checkUserExists(userId),
                Event.checkEventExists(eventId)
            ]);
            if (userExists && eventExists) {
                let updateEvent = await Event.editEntity(
                    { _id: eventExists._id },
                    { $push: { 'participants': { userId, joinedAt: new Date() } } }
                );
                this.sendResponse(res, RESPONSE.SUCCESS, updateEvent.data);
                SocketIO.userRegisterEvent(userExists.name, eventExists.title);
            } else {
                if (!userExists) return this.sendResponse(res, RESPONSE.USER.USER_NOT_FOUND);
                if (!eventExists) return this.sendResponse(res, RESPONSE.EVENT.EVENT_NOT_FOUND);
            }
        } catch (err) {
            next(err);
        }
    }
}

export const UserController = new UserClass();