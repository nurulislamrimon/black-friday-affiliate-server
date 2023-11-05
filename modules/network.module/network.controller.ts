import { NextFunction, Request, Response } from "express";
import * as networkServices from "./network.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import { getPostByNetworkIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Network by Id controller
export const getANetworkByNetworkNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const NetworkName = req.params.networkName;

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

// update a network controller
export const updateANetworkController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { networkName, networkPhotoURL } = req.body;
    const networkId = new Types.ObjectId(req.params.id);
    const existNetwork = await networkServices.getNetworkByIdService(networkId);

    if (!existNetwork) {
      throw new Error("Network doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);

      const session = await mongoose.startSession();

      session.startTransaction();
      try {
        // update the network
        const result = await networkServices.updateANetworkService(
          networkId,
          {
            ...req.body,
            existNetwork,
            updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
          },
          session
        );
        // update all posts that uses refference of the network
        if (networkName) {
          await networkServices.updateRefferencePosts(
            networkId,
            result,
            session
          );
        }

        res.send({
          success: true,
          data: result,
        });
        console.log(`network is updated!`);
        await session.commitTransaction();
      } catch (error) {
        session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
  }
);
// Delete a Network controller
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
