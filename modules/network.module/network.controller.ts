import { NextFunction, Request, Response } from "express";
import * as networkServices from "./network.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByNetworkIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Network by Id controller
export const getANetworkByNetworkNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// get Network by Id controller
export const getANetworkByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// add new Network controller
export const addNewNetworkController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// get all Networks
export const getAllNetworksController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await networkServices.getAllNetworks(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Networks are responsed!`);
  }
);

// update a Network controller
export const updateANetworkController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// update a Network controller
export const deleteANetworkController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);
