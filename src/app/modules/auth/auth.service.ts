// @ts-nocheck
// @ts-nocheck
import pkg from "@prisma/client";
const { Staff } = pkg;
import prisma from "../../../utils/prisma.js";
import ApiError from "../../../errors/ApiError.js";
import httpStatus from "http-status";
import { Argon2id } from "oslo/password";

// signup
const signupStaff = async (data: Staff) => {
  data.password = await new Argon2id().hash(data.password);
  const { password, ...user } = await prisma.staff.create({ data });

  return user;
};

// login
const loginStaff = async (email: string, password: string) => {
  const user = await prisma.staff.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          roleDetails: true
        }
      }
    }
  });

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Invaild email");

  // Block Super Admin from logging into main frontend
  const isSuperAdmin = user.roles.some(r =>
    r.roleDetails?.name === 'Super Admin'
  );
  if (isSuperAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, "Super Admin must use admin portal");
  }

  const validPassword = await new Argon2id().verify(user.password, password);
  if (!validPassword)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invaild password");

  const { password: p, otp, otpGeneratedAt, otpExpiresAt, ...data } = user;
  return data;
};

// generate OTP
const generateOtpForStaff = async (phone: string) => {
  const user = await prisma.staff.findUnique({ where: { phone } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // limits the user to one otp per 5 minutes
  if (user.otpGeneratedAt) {
    const diff =
      new Date(user.otpGeneratedAt).getTime() +
      5 * 60 * 1000 -
      new Date().getTime();

    if (diff > 0)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please wait ${Math.round(diff / 1000)} seconds before generating new OTP`,
      );
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedOtp = await new Argon2id().hash(otp);
  const otpGeneratedAt = new Date();
  const otpExpiresAt = new Date(otpGeneratedAt.getTime() + 3 * 60 * 1000);

  await prisma.staff.update({
    where: { id: Number(user.id) },
    data: { otp: hashedOtp, otpGeneratedAt, otpExpiresAt },
  });

  return { otp };
};

// login with OTP
const loginStaffWithOtp = async (phone: string, otp: string) => {
  const user = await prisma.staff.findUnique({
    where: { phone },
    include: {
      roles: {
        include: {
          roleDetails: true
        }
      }
    }
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Invalid user or OTP");

  // Block Super Admin from logging into main frontend
  const isSuperAdmin = user.roles.some(r =>
    r.roleDetails?.name === 'Super Admin'
  );
  if (isSuperAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, "Super Admin must use admin portal");
  }

  const validOtp =
    (await new Argon2id().verify(user.otp ?? "", otp)) &&
    new Date() < new Date(user.otpExpiresAt!);
  if (!validOtp)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user or OTP");

  const { password, otp: o, otpGeneratedAt, otpExpiresAt, ...data } = user;
  return data;
};

const refreshStaffData = async (id: string) => {
  const user = await prisma.staff.findUnique({
    where: { id: Number(id) },
    include: {
      roles: {
        include: {
          roleDetails: true
        }
      }
    }
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const { password, otp, otpGeneratedAt, otpExpiresAt, ...data } = user;
  return data;
};

export const authService = {
  signupStaff,
  loginStaff,
  generateOtpForStaff,
  loginStaffWithOtp,
  refreshStaffData,
};
