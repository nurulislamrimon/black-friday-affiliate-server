import { NextFunction, Request, Response } from "express";
import * as networkServices from "./network.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByNetworkIdService } from "../post.module/post.services";

// get Network by Id controller
export const getANetworkByNetworkNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const NetworkName = req.params.NetworkName;

    const result = await networkServices.getNetworkByNetworkNameService(
      NetworkName
    );
    if (!result) {
      throw new Error("Network not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

// get Network by Id controller
export const getANetworkByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const NetworkId = new Types.ObjectId(req.params.id);

    const result = await networkServices.getNetworkByIdService(NetworkId);
    if (!result) {
      throw new Error("Network not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

// add new Network controller
export const addNewNetworkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { networkName } = req.body;
    const existNetwork = await networkServices.getNetworkByNetworkNameService(
      networkName
    );

    if (!networkName) {
      throw new Error("Please enter required information: networkName!");
    } else if (existNetwork?.networkName === networkName) {
      throw new Error("Network already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await networkServices.addNewNetworkService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Network ${result._id} is added!`);
    }
  } catch (error) {
    next(error);
  }
};

// get all Networks
export const getAllNetworksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await networkServices.getAllNetworks(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Networks are responsed!`);
  } catch (error) {
    next(error);
  }
};

// update a Network controller
export const updateANetworkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const existNetwork = await networkServices.getNetworkByIdService(postId);

    if (!existNetwork) {
      throw new Error("Network doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await networkServices.updateANetworkService(postId, {
        ...req.body,
        existNetwork,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Network ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};

// update a Network controller
export const deleteANetworkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const NetworkId = new Types.ObjectId(req.params.id);
    const existNetwork = await networkServices.getNetworkByIdService(NetworkId);

    const isRelatedPostExist = await getPostByNetworkIdService(NetworkId);

    if (!existNetwork) {
      throw new Error("Network doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This Network has some posts, You can't delete the Network!"
      );
    } else {
      const result = await networkServices.deleteANetworkService(NetworkId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Network ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
