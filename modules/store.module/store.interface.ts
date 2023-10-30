import { Types } from "mongoose";

export default interface IStore {
  storeName: string;
  storePhotoURL: string;
  storeLink: string;
  countries: string[];
  countriesFlag: string[];

  storeDescription?: string;
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
