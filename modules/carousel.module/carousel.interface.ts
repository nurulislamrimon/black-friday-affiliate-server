import { Types } from "mongoose";

export default interface ICarousel {
  carousel: [{ photoURL: string; couponCode?: string; externalLink?: string }];
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
