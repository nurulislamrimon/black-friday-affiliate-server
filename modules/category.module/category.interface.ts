import { Types } from "mongoose";

export default interface ICategory {
  categoryName: string;
  categoryCountries?: string[];

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
