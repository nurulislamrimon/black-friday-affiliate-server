import { Types } from "mongoose";

export default interface IContact {
  contact: { contactNo: string; isActive: boolean };
  postBy: {
    name: string;
    email: string;
    moreAboutUser: Types.ObjectId;
  };
}
