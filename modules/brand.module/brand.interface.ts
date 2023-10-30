import { Types } from "mongoose";

export default interface IBrand {
  brandName: string;
  brandPhotoURL: string;
  brandLink: string;
  countries: string[];

  brandDescription?: string;
  howToUse?: {
    id: string;
    photoURL?: string;
    type: string;
    content: string;
  }[][];

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
