import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { PortalService } from "./portal.service.js";

const createPost = catchAsync(async (req: Request, res: Response) => {
    const staff = (req as any).user;
    const result = await PortalService.createPost(req.body, staff);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const result = await PortalService.getAllPosts(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Posts retrieved successfully",
        data: result,
    });
});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
    const staff = (req as any).user;
    const result = await PortalService.getMyPosts(staff.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My posts retrieved successfully",
        data: result,
    });
});

const likePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { like } = req.body;
    const staff = (req as any).user;

    const result = await PortalService.likePost(id, staff.id, like);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: like ? "Post liked" : "Post unliked",
        data: result,
    });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PortalService.deletePost(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post deleted successfully",
        data: result,
    });
});

const getPopularTags = catchAsync(async (req: Request, res: Response) => {
    const result = await PortalService.getPopularTags();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Popular tags retrieved successfully",
        data: result,
    });
});

export const PortalController = {
    createPost,
    getAllPosts,
    getMyPosts,
    likePost,
    deletePost,
    getPopularTags,
};
