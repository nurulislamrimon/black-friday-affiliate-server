import { Types } from "mongoose";
export default interface IUser {
  photoURL?: string;
  name: string;
  email: string;
  country: string;
  isVerified: boolean;
  newPosts: [
    {
      moreAboutPost: Types.ObjectId;
      status: string;
    }
  ];
  phoneNumber?: string;
  // password?: string;
  // confirmPassword?: string;
  uid?: string;
  favourite: {
    stores: Types.ObjectId[];
    posts: Types.ObjectId[];
  };
}
