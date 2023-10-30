import { ObjectId, Types } from "mongoose";

export default interface IPost {
  postTitle?: string;
  postPhotoUrl?: string;
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

  store: ObjectId;
  brand: ObjectId;
  category: ObjectId;
  campaign: ObjectId;
  network?: ObjectId;

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
