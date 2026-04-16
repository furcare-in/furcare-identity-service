import { Response } from "express";

type TApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
};

const sendResponse = <T>(res: Response, data: TApiResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};

export default sendResponse;
