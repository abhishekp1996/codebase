/**
 * @file mongo.database
 * @description defines mongodb database methods
 * @created 2020-02-01 21:51:53
*/

import mongoose from "mongoose";

import { CONFIG } from "../../common";

class Mongo {

    constructor() { }

    /**
     * connects to the mongo database
     * @param uri - the new version of mongodb connection string
     */
    async connectDatabase(uri: string) {
        mongoose.connect(uri,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true,
                poolSize: CONFIG.DB_POOLSIZE,
                useUnifiedTopology: true
            }
        ).then(
            () => {
                console.log(`SUCCESS: database connected to "${uri}"`);
            },
            (err) => {
                console.log(`ERROR: database failed to connect "${uri}"`);
                console.log('ERROR: ', err);
                process.exit(1);
            }
        );
        mongoose.set('debug', true);
    }
}

export const mongoDOA = new Mongo();