/**
 * @file socket.services
 * @description defines socket methods
 * @created 2020-02-03 00:14:50
*/

import { Server } from 'http'
import Socket from "socket.io";

export class SocketIO {

    public static io: Socket.Server;
    private static _instance: SocketIO;

    constructor() { }

    /** returns the instance of the socket */
    static instance(server: Server): SocketIO {

        // create new instance if not already exists
        if (typeof this._instance === "undefined") {
            this.io = Socket(server); // init socket server
            this.initConnection(); // init connection
            this._instance = new this(); // initialize instance with SocketIO object
        }
        return this._instance;
    }

    /** for connecting with socket */
    private static initConnection() {
        this.io.on('connection', async (client: Socket.Socket) => {
            debugLog(`\x1b[32mSUCCESS: Client Connected: \x1b[33m${client.id}\x1b[37m`);

            // register event handlers
            this.disconnectHandler(client);
        });
    }

    /** handler for socket disconnection */
    private static disconnectHandler(client: Socket.Socket) {
        client.on('disconnect', () => {
            debugLog(`\x1b[36mINFO: Client Disconnected: \x1b[33m${client.id}\x1b[37m`);
        });
    }

    /** emits event to single socket client */
    static userRegisterEvent(userName: string, eventName: string) {
        this.io.emit('register', { userName, eventName });
    }

}

// helper function to debug socket log
function debugLog(...args: any) {
    console.log("SOCKET DEBUG -> ", ...args);
}