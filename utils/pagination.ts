import { Model, Document, Query } from 'mongoose';
import { IPaginationResponse, IPaginateOptions } from '../types/paginationType';

export async function paginate<T extends Document>(
    model: Model<T>,
    options: IPaginateOptions<T>
): Promise<IPaginationResponse> {
    const {
        page = 1,
        limit = 10,
        query = {},
        sort = { createdAt: -1 },
        select,
        populate,
    } = options;

    const skip = (page - 1) * limit;
    const totalItems = await model.countDocuments(query);

    let queryBuilder: Query<T[], T, {}, T > = model.find(query).sort(sort).skip(skip).limit(limit);

    if (select) {
        queryBuilder = queryBuilder.select(select);
    }

    if (populate) {
        queryBuilder = queryBuilder.populate(populate);
    }

    const data = await queryBuilder.exec();

    return {
        success: true,
        pageNo: Number(page),
        offset: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        data,
    };
}