import { NextFunction, Request, Response } from "express";
import * as campaignServices from "./campaign.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import { getPostByCampaignIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Campaign by Id controller
export const getACampaignController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const campaignId = new Types.ObjectId(req.params.id);

    const result = await campaignServices.getCampaignByIdService(campaignId);
    if (!result) {
      throw new Error("Campaign not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);
// get Campaign by Id controller
export const getACampaignByCampaignNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const campaignName = req.params.CampaignName;

    const result = await campaignServices.getCampaignByCampaignNameService(
      campaignName
    );
    if (!result) {
      throw new Error("Campaign not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);
// add new Campaign controller
export const addNewCampaignController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { campaignPhotoURL, campaignName } = req.body;
    const existCampaign =
      await campaignServices.getCampaignByCampaignNameService(campaignName);

    if (!campaignPhotoURL || !campaignName) {
      throw new Error(
        "Please enter required information:  campaignName, campaignPhotoURL!"
      );
    } else if (existCampaign?.campaignName === campaignName) {
      throw new Error("Campaign already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await campaignServices.addNewCampaignService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Campaign ${result._id} is added!`);
    }
  }
);
// get all active Campaigns
export const getAllCampaignsClientController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignServices.getAllCampaigns(req.query, false);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Campaigns are responsed!`);
  }
);
// get all Campaigns
export const getAllCampaignsAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignServices.getAllCampaigns(req.query, true);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Campaigns are responsed!`);
  }
);

// update a campaign controller
export const updateACampaignController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { campaignName, campaignPhotoURL } = req.body;
    const campaignId = new Types.ObjectId(req.params.id);
    const existCampaign = await campaignServices.getCampaignByIdService(
      campaignId
    );

    if (!existCampaign) {
      throw new Error("Campaign doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);

      const session = await mongoose.startSession();

      session.startTransaction();
      try {
        // update the campaign
        const result = await campaignServices.updateACampaignService(
          campaignId,
          {
            ...req.body,
            existCampaign,
            updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
          },
          session
        );
        // update all posts that uses refference of the campaign
        if (campaignName || campaignPhotoURL) {
          await campaignServices.updateRefferencePosts(
            campaignId,
            result,
            session
          );
        }

        res.send({
          success: true,
          data: result,
        });
        console.log(`Campaign is updated!`);
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
// update a Campaign controller
export const deleteACampaignController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const CampaignId = new Types.ObjectId(req.params.id);
    const existCampaign = await campaignServices.getCampaignByIdService(
      CampaignId
    );

    const isRelatedPostExist = await getPostByCampaignIdService(CampaignId);

    if (!existCampaign) {
      throw new Error("Campaign doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This Campaign has some posts, You can't delete the Campaign!"
      );
    } else {
      const result = await campaignServices.deleteACampaignService(CampaignId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Campaign ${result} is added!`);
    }
  }
);
