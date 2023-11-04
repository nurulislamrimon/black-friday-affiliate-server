import { ObjectId, Types } from "mongoose";

export default interface IPost {
  postTitle?: string;
  postPhotoURL?: string;
  expireDate?: Date;
  postType: string;
  discountPercentage?: Number;
  productPreviewLink?: string;
  couponCode?: string;
  dealLink?: string;
  countries: string[];
  postDescription?: string;
  isVerified: boolean;
  revealed: number;

  store: { storeName: string; storePhotoURL: string; moreAboutStore: ObjectId };
  brand?: {
    brandName: string;
    brandPhotoURL: string;
    moreAboutBrand: ObjectId;
  };
  category?: {
    categoryName: string;
    moreAboutCategory: ObjectId;
  };
  campaign?: {
    campaignName: string;
    campaignPhotoURL: string;
    moreAboutCampaign: ObjectId;
  };
  network?: {
    networkName: string;
    moreAboutNetwork: ObjectId;
  };

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
