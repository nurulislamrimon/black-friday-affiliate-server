import { NextFunction, Request, Response } from "express";
import * as userServices from "./user.services";
import { generate_token } from "../../utils/generate_token";
import { Types } from "mongoose";
import { getStoreByIdService } from "../store.module/store.services";
import { getPostByIdService } from "../post.module/post.services";
import { getPayloadFromToken } from "../../utils/get_payload_from_token";

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, uid, picture } = req.user;
    const { countries, phoneNumber } = req.body;
    const existUser = await userServices.getUserByEmailService(email);

    let newUser;
    let accessToken;
    if (!existUser) {
      newUser = await userServices.addNewUserService({
        email,
        name,
        countries,
        phoneNumber,
        uid,
        photoURL: picture,
      });
    } else {
      accessToken = generate_token({ email: email });
      const refreshToken = generate_token(
        { email: email },
        "365d",
        process.env.refresh_key
      );
      const cookieOptions = {
        secure: true,
        expires: new Date(Date.now() + 50000),
      };
      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.send({
        success: true,
        refreshToken,
        data: { user: existUser || newUser, accessToken },
      });
      console.log(`user ${existUser._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};
export const refreshUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRefreshTokenFromCookies = req.cookies.refreshToken;
    const userRefreshTokenFromHeader = req.headers.cookies;

    if (!userRefreshTokenFromCookies && !userRefreshTokenFromHeader) {
      throw new Error("Refresh token not found");
    }

    const payload = getPayloadFromToken(
      userRefreshTokenFromCookies || userRefreshTokenFromHeader,
      process.env.refresh_key
    );

    const accessToken = generate_token({ email: payload?.email });

    res.send({
      success: true,
      data: { accessToken },
    });
    console.log(`New access token created from refresh token`);
  } catch (error) {
    next(error);
  }
};

// about me by token
export const getAboutMeUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.decoded.email;
    const result = await userServices.getUserByEmailService(email);
    if (!result) {
      throw new Error("User not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
      console.log(`user responsed!`);
    }
  } catch (error) {
    next(error);
  }
};
// update me from token
export const updateAboutMeUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.body.decoded.email;
    const isUserExist = await userServices.getUserByEmailService(userEmail);

    if (!isUserExist) {
      throw new Error("User not found!");
    }
    const { newPosts, favourite, email, ...rest } = req.body;
    const result = await userServices.updateMeByEmailService(
      isUserExist._id,
      rest
    );
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// get all user
export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getAllUserService(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} user responsed!`);
  } catch (error) {
    next(error);
  }
};
// get all favourite stores
export const getAllFavouriteStoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getFavouriteStoreService(
      req.body.decoded.email
    );
    res.send({
      success: true,
      result,
    });
    console.log(`${result?._id} favourite stores responsed!`);
  } catch (error) {
    next(error);
  }
};
// get all favourite posts
export const getAllFavouritePostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getFavouritePostService(
      req.body.decoded.email
    );
    res.send({
      success: true,
      result,
    });
    console.log(`${result?._id} favourite posts responsed!`);
  } catch (error) {
    next(error);
  }
};
// get add favourite stores
export const addAndRemoveStoreFromFavouriteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = new Types.ObjectId(req.params.id);
    const isStoreExist = await getStoreByIdService(storeId);
    if (!isStoreExist) {
      throw new Error("Sorry, Store doesn't exist!");
    } else {
      const result = await userServices.addAndRemoveStoreFromFavouriteService(
        req.body.decoded.email,
        storeId
      );
      res.send({
        success: true,
        result,
      });
      console.log(`Store favourite list modified!`);
    }
  } catch (error) {
    next(error);
  }
};
// get add favourite stores
export const addAndRemovePostFromFavouriteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const PostId = new Types.ObjectId(req.params.id);
    const isPostExist = await getPostByIdService(PostId);
    if (!isPostExist) {
      throw new Error("Sorry, Post doesn't exist!");
    } else {
      const result = await userServices.addAndRemovePostFromFavouriteService(
        req.body.decoded.email,
        PostId
      );
      res.send({
        success: true,
        result,
      });
      console.log(`Post favourite list modified!`);
    }
  } catch (error) {
    next(error);
  }
};
// get all notification counted
export const getUnreadedNotificationCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getUnreadedNotificationCountService(
      req.body.decoded.email
    );
    res.send({
      success: true,
      data: result,
    });
    console.log(`${result} user responsed!`);
  } catch (error) {
    next(error);
  }
};
// get all notifications
export const getNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.getNotificationService(
      req.body.decoded.email
    );
    res.send({
      success: true,
      data: result,
    });
    console.log(`${result?._id} user responsed!`);
  } catch (error) {
    next(error);
  }
};
// set post status to readed
export const setNotificationReadedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const result = await userServices.setNotificationReadedService(
      req.body.decoded.email,
      postId
    );
    res.send({
      success: true,
      data: result,
    });
    console.log(`notification ${postId} is readed!`);
  } catch (error) {
    next(error);
  }
};
