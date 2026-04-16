import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../../utils/env.js";
import ApiError from "../../errors/ApiError.js";
import prisma from "../../utils/prisma.js";

const auth = () => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization;

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
            }

            if (token.startsWith("Bearer ")) {
                token = token.slice(7, token.length).trimLeft();
            }

            const verifiedUser = jwt.verify(
                token as string,
                env.jwt.secret as string,
            ) as JwtPayload;

            const user = await prisma.staff.findUnique({
                where: {
                    id: verifiedUser.id,
                }
            });

            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, "User not found");
            }

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;
