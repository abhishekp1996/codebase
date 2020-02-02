/**
 * @file base.entity
 * @description defines base entity methods for other entities
 * @created 2020-01-31 00:04:35
 * @author Abhishek Pathak
*/

import { Model, Types } from "mongoose";

export default class BaseEntity {

    constructor(protected model: Model<any>) {
        this.model = model;
    }

    /** 
     * finds a single user based on payload condition
     * @params payload (condition), projection
     */
    async findOne(condition, project = {}, options: any = {}) {
        condition.isDelete = false;
        if (condition._id) condition._id = Types.ObjectId(condition._id);
        return this.model.findOne(condition, project, options).lean().exec();
    }

    /**
     * finds multiple records based on condition
     * @params payload, projection
     */
    async findMany(condition, project = {}) {
        condition.isDelete = false;
        return await this.model.find(condition, project).lean().exec();
    }

    /**
     * counts the documents based on query
     * @params condition
     */
    async count(condition): Promise<number> {
        condition.isDelete = false;
        return this.model.countDocuments(condition).lean().exec();
    }

    /**
     * distinct documents
     * @params condition
     */
    async distinct(key: string, condition): Promise<any> {
        condition.isDelete = false;
        return this.model.distinct(key, condition).lean().exec();
    }

    /**
     * updates the entity record with the payload
     * @params condition, payload, options { multi: [boolean] }
     */
    async editEntity(condition, payload, options: any = {}) {
        condition.isDelete = false;
        if (options.multi) {
            await this.model.updateMany(condition, payload, options).exec();
            return { type: 'MULTI' };
        } else {
            if (typeof options.new === 'undefined') options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, payload, options).lean().exec();
            if (updatedData) return { type: 'SINGLE', data: updatedData };
            else return { type: 'SINGLE' };
        }
    }

    /**
     * updates and sets the user fields record with the payload fields
     * @params condition, payload
     * @param options.multi - updates multiple records
     */
    async updateEntity(condition, payload, options: any = {}) {
        condition.isDelete = false;
        if (options.multi) {
            await this.model.updateMany(condition, { $set: payload }, options).exec();
            return { type: 'MULTI' };
        } else {
            if (typeof options.new === 'undefined') options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, { $set: payload }, options).lean().exec();
            if (updatedData) return { type: 'SINGLE', data: updatedData };
            else return { type: 'SINGLE' };
        }
    }

    /**
     * basic aggregate function
     * @param
     */
    async basicAggregate(pipeline: any[]) {
        return this.model.aggregate(pipeline).exec();
    }

    /**
     * aggregates data from the pipeline
     * @param pipeline
     * @param options.page - current page number
     * @param options.limit - fetch limit for records
     * @param options.getCount - (optional) gets the result with total record count
     * @param options.ranged - (optional) ranged based pagination
     */
    async paginateAggregate(pipeline: any[], options: any = {}) {
        // if total records count is required, options.getCount should be true
        if (options.getCount) {
            pipeline.push({
                $facet: {
                    'total': [{ $count: 'count' }],
                    'result': [{ $skip: (options.page - 1) * options.limit }, { $limit: options.limit }]
                }
            });

            // aggregate and check if current records are greater than total records
            let aggregateData = await this.model.aggregate(pipeline).exec();
            if (aggregateData.length) {
                if (aggregateData[0].result.length) {
                    let paginationResult: any = { next: false, page: options.page, total: aggregateData[0].total[0].count };
                    if ((options.limit * options.page) < paginationResult.total) {
                        paginationResult.next = true;
                    }
                    paginationResult.result = aggregateData[0].result;
                    return paginationResult;
                } else return { next: false, result: [], page: options.page, total: aggregateData[0].total.length ? aggregateData[0].total[0].count : 0 }
            } else throw new Error('Error in paginate aggregation pipeline');
        } else {
            // if skip and limit are not already stages of pipeline 
            if (!options.prePaginated) {
                // if ranged documents are required, `options.ranged` should contain the expression
                if (options.range) pipeline.push({ $match: options.range })
                // else use the default pagination logic
                else pipeline.push({ $skip: (options.page - 1) * options.limit });
                pipeline.push({ $limit: options.limit + 1 });
            }

            // aggregate and check if more records exists when greater than limit
            let aggregateData = await this.model.aggregate(pipeline).exec();
            if (aggregateData.length) {
                let paginationResult: any = { next: false, page: options.page };
                if (aggregateData.length > options.limit) {
                    paginationResult.next = true;
                    paginationResult.result = aggregateData.slice(0, aggregateData.length - 1);
                } else paginationResult.result = aggregateData;
                return paginationResult;
            } else return { next: false, result: [], page: options.page }
        }
    }

    /**
     * removes data from collection
     * @param condition
     */
    async remove(condition: any) {
        let removedData = await this.model.deleteOne(condition).exec();
        if (removedData.ok && removedData.n) return { success: true };
        else return { success: false };
    }
}