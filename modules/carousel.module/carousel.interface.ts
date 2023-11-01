import { Types } from "mongoose";

export default interface ICarousel {
  country: string;
  items: [{ photoURL: string; couponCode?: string; externalLink?: string }];
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
