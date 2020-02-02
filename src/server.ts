/**
 * @file server
 * @description the server entry point
 * @created 2020-02-01 22:58:34
*/

import { CONFIG } from "./common";
import App from "./app";
import { SocketIO } from "@services";


// create server and start listening on port
let server = App.instance.listen(CONFIG.APP_PORT);

// initiliaze socket instance
SocketIO.instance(server);

// add server listener
server.on('listening', function () {
    console.log(`Server started listening on port ${CONFIG.APP_PORT}`);
});