import { Types } from "mongoose";

export default interface ICampaign {
  campaignName: string;
  campaignPhotoURL: string;
  countries: string[];
  startPeriod: Date;
  endPeriod: Date;

  postBy: {
    name: string;
    email: string;
    moreAboutUser: Types.ObjectId;
  };
  updateBy?: [
    {
      name: string;
      email: string;
      moreAboutUser: Types.ObjectId;
    }
  ];
}
