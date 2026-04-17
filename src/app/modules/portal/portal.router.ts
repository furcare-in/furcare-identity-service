// @ts-nocheck
import express from "express";
import { PortalController } from "./portal.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
    "/posts",
    auth(),
    PortalController.createPost
);

router.get(
    "/posts",
    auth(),
    PortalController.getAllPosts
);

router.get(
    "/posts/my-posts",
    auth(),
    PortalController.getMyPosts
);

router.get(
    "/tags/popular",
    auth(),
    PortalController.getPopularTags
);

router.post(
    "/posts/:id/like",
    auth(),
    PortalController.likePost
);

router.delete(
    "/posts/:id",
    auth(),
    PortalController.deletePost
);

export const portalRouter = router;
