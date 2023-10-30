import { Types } from "mongoose";
import { Schema, model } from "mongoose";
import IUser from "./user.interface";
// import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new Schema<IUser>(
  {
    photoURL: { type: String, validate: validator.isURL },
    name: { type: String, required: true },
    email: { type: String, required: true, validate: validator.isEmail },
    country: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    newPosts: [
      {
        moreAboutPost: { type: Types.ObjectId, ref: "Post" },
        status: {
          type: String,
          enum: ["readed", "unreaded"],
          default: "unreaded",
        },
      },
    ],
    phoneNumber: String,
    // password: String,
    // confirmPassword: String,
    uid: String,
    favourite: {
      stores: [{ type: Types.ObjectId, ref: "Store" }],
      posts: [{ type: Types.ObjectId, ref: "Post" }],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", async function (next) {
  if (this.uid) {
    this.isVerified = true;
    next();
  }
  // ===========for email password login=========
  // else if (this.password) {
  //   const isStrongPassword = /[a-zA-Z]/g.test(this.password);
  //   if (!isStrongPassword) {
  //     throw new Error("Please provide a strong password!");
  //   } else if (this.password === this.confirmPassword) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //     this.confirmPassword = undefined;
  //     next();
  //   } else {
  //     throw new Error(
  //       "Please make sure password and confirm password are same!"
  //     );
  //   }
  // }
  else {
    throw new Error("UID not found!");
  }
});
const User = model<IUser>("User", userSchema);
export default User;
