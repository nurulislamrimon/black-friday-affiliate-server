import { Types } from "mongoose";

export default interface ICampaign {
  campaignName: string;
  campaignPhotoURL: string;
  startPeriod: Date;
  endPeriod: Date;
  // campaignCountries?: string[];

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
