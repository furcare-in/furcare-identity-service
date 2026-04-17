// @ts-nocheck
import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import { authValidator } from "./auth.validator.js";
import rateLimit from "express-rate-limit";

const authRouter = Router();
const adminAuthRouter = Router();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 65, // Limit each IP to 65 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

authRouter.use(limiter);
adminAuthRouter.post(
  "/signup",
  validateRequest(authValidator.signup),
  authController.signupStaff,
);
adminAuthRouter.post(
  "/login",
  validateRequest(authValidator.login),
  authController.loginStaff,
);
adminAuthRouter.post(
  "/generate-otp",
  validateRequest(authValidator.generateOtp),
  authController.generateOtpForStaff,
);
adminAuthRouter.post(
  "/login-with-otp",
  validateRequest(authValidator.loginWithOtp),
  authController.loginStaffWithOtp,
);

adminAuthRouter.get(
  "/refresh",
  auth(),
  authController.refreshStaffData,
);

const authRoutes = [{ path: "/staff", router: adminAuthRouter }];
authRoutes.forEach((route) => authRouter.use(route.path, route.router));

export default authRouter;
