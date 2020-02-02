/**
 * @file builders/index
 * @description exposes builders object for query
 * @created 2020-02-02 23:21:00
 */

import { Types } from "mongoose";

export const UsersList = function (payload) {
    let pipeline: any = [],
        matchCondition: any = { isDelete: false };

    if (payload.search) matchCondition['name'] = { $regex: new RegExp(`^${payload.search}`, 'i') };

    if (payload.createdFrom || payload.createdTo) {
        matchCondition.createdAt = {};
        if (payload.createdFrom) matchCondition['createdAt']['$gte'] = payload.createdFrom;
        if (payload.createdTo) matchCondition['createdAt']['$lte'] = payload.createdTo;
    }

    pipeline.push({ $match: matchCondition });
    return pipeline;
}

export const EventDetail = function (eventId: string) {
    let pipeline: any = [],
        matchCondition = {
            _id: Types.ObjectId(eventId),
            isDelete: false
        };

    pipeline.push(
        { $match: matchCondition },
        { $unwind: { path: '$participants', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'users',
                localField: 'participants.userId',
                foreignField: '_id',
                as: 'userData'
            }
        },
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$_id',
                title: { $first: '$title' },
                slug: { $first: '$slug' },
                startDate: { $first: '$startDate' },
                endDate: { $first: '$endDate' },
                participants: {
                    $push: {
                        name: '$userData.name',
                        username: '$userData.username',
                        score: '$userData.score',
                        joinedAt: '$participants.joinedAt'
                    }
                },
            }
        }
    );

    return pipeline;
}