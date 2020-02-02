/**
 * @file user.entity
 * @description defines user entity methods
 * @created 2020-01-30 23:57:50
*/

import BaseEntity from "./base.entity";
import UserModel from "@models/user.model";

class UserEntity extends BaseEntity {

    constructor(model) {
        super(model);
    }

    /** creates a new user */
    async createUser(payload) {
        return new this.model(payload).save();
    }

    /** check if username exists */
    async checkUsernameExists(username: string) {
        return this.findOne({ username });
    }

    /** check if user exists with userId */
    async checkUserExists(userId: string) {
        return this.findOne({ _id: userId });
    }

    /** delete user */
    async deleteUser(userId: string) {
        return this.updateEntity({ _id: userId }, { isDelete: true });
    }
}

export const User = new UserEntity(UserModel);