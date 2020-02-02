/**
 * @file response.common
 * @description defines common response methods
 * @created 2020-02-01 22:54:16
*/

export const RESPONSE = {
    USER: {
        USER_NOT_FOUND: { httpCode: 400, statusCode: 101, message: 'User not found' },
        USERNAME_EXISTS: { httpCode: 400, statusCode: 102, message: 'This username is already taken' }
    },
    EVENT: {
        EVENT_NOT_FOUND: { httpCode: 400, statusCode: 201, message: 'Event not found' },
    },
    SUCCESS: { httpCode: 200, statusCode: 100, message: 'Success' }
}