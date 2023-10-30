import { NextFunction, Request, Response } from "express";
import * as campaignServices from "./campaign.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByCampaignIdService } from "../post.module/post.services";

// get Campaign by Id controller
export const getACampaignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
// get Campaign by Id controller
export const getACampaignByCampaignNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
// get all active Campaigns
export const getAllActiveCampaignsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await campaignServices.getAllActiveCampaigns(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Campaigns are responsed!`);
  } catch (error) {
    next(error);
  }
};
// add new Campaign controller
export const addNewCampaignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { campaignPhotoURL, campaignName, countries } = req.body;
    const existCampaign =
      await campaignServices.getCampaignByCampaignNameService(campaignName);

    if (!campaignPhotoURL || !campaignName || !countries) {
      throw new Error(
        "Please enter required information:  campaignName, campaignPhotoURL, countries!"
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
      console.log(`Campaign ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
// get all Campaigns
export const getAllCampaignsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await campaignServices.getAllCampaigns(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Campaigns are responsed!`);
  } catch (error) {
    next(error);
  }
};
// update a Campaign controller
export const updateACampaignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const existCampaign = await campaignServices.getCampaignByIdService(postId);

    if (!existCampaign) {
      throw new Error("Campaign doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await campaignServices.updateACampaignService(postId, {
        ...req.body,
        existCampaign,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Campaign ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
// update a Campaign controller
export const deleteACampaignController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
