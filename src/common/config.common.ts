/**
 * @file config.common
 * @description defines configuration for application
 * @created 2020-02-01 01:17:37
*/

import dotenv from "dotenv";

// configure the environment
dotenv.config({ path: "bin/.env" });

// configurations and credentails goes in here
export const CONFIG = {
    DB_URI: <string>process.env.DB_URI,
    APP_PORT: process.env.PORT,
    DB_POOLSIZE: 50
}

export const BASE = {
    URL: <string>process.env.BASE_URL
}