import { Types } from "mongoose";

export default interface INetwork {
  networkName: string;
  networkCountries?: string[];

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
