import { Schema, model } from "mongoose";
import validator from "validator";
import { Types } from "mongoose";
import INetwork from "./network.interface";

const networkSchema = new Schema<INetwork>(
  {
    networkName: { type: String, required: true },

    postBy: {
      name: { type: String, required: true },
      email: { type: String, required: true, validate: validator.isEmail },
      moreAboutUser: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    updateBy: [
      {
        name: String,
        email: { type: String, validate: validator.isEmail },
        moreAboutUser: {
          type: Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Network = model<INetwork>("Network", networkSchema);
export default Network;
