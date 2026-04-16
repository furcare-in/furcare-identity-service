import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import jwt from "jsonwebtoken";
import env from "../../../utils/env.js";

// signup
const signupStaff = catchAsync(async (req, res) => {
  const data = req.body;
  const response = await authService.signupStaff(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User signup successfully",
    data: response,
  });
});

// login
const loginStaff = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.loginStaff(email, password);
  const token = jwt.sign({ id: response.id }, env.jwt.secret);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User signup successfully",
    data: { ...response, token },
  });
});

// generate OTP
const generateOtpForStaff = catchAsync(async (req, res) => {
  const { phone } = req.body;
  const response = await authService.generateOtpForStaff(phone);

  res.status(httpStatus.OK).json({
    success: true,
    message: "OTP sent successfully",
    data: env.common.nodeEnv === "development" ? response : undefined,
  });
});

// login with OTP
const loginStaffWithOtp = catchAsync(async (req, res) => {
  const { phone, otp } = req.body;
  const response = await authService.loginStaffWithOtp(phone, otp);
  const token = jwt.sign({ id: response.id }, env.jwt.secret);

  res.status(httpStatus.OK).json({
    success: true,
    message: "OTP sent successfully",
    data: { ...response, token },
  });
});

// refresh staff data
const refreshStaffData = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const response = await authService.refreshStaffData(user.id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Staff data refreshed successfully",
    data: response,
  });
});

export const authController = {
  signupStaff,
  loginStaff,
  generateOtpForStaff,
  loginStaffWithOtp,
  refreshStaffData,
};
