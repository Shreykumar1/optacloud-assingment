import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../model/userModal";
import mongoose from "mongoose";


const signToken = (id: mongoose.Types.ObjectId): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (
  user: IUser,
  statuscode: number,
  res: Response
) => {
  const token = signToken(user.id);

  user.password = undefined;
  user.passwordConfirm = undefined;

  const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {
    token,
  });

  res.status(statuscode).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirm: string;
  };
}

export const signup = catchAsync(
  async (
    req: SignupRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.body.password !== req.body.passwordConfirm) {
      res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    const newUser = (await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })) as IUser;

    await createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please enter email and password",
    });
  }

  const user: IUser = await User.findOne({ email }).select("password");

  const correct = user.password
    ? await User.passwordCorrect(password, user.password)
    : false;
  if (!user || !correct) {
    return res.status(401).json({
      status: "fail",
      message: "please check your credentials",
    });
  }

  await createSendToken(user, 200, res);
});

interface CustomRequest extends Request {
  token?: string;
  user?: IUser;
}

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! please log in",
      });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const freshUser = await User.findById((decode as jwt.JwtPayload).id);

    if (!freshUser)
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists",
      });

    if (req.token && freshUser.token !== req.token) {
      res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    req.user = freshUser;

    next();
  }
);

