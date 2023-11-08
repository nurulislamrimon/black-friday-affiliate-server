import { Schema, model } from "mongoose";
import validator from "validator";
import { Types } from "mongoose";
import ICampaign from "./campaign.interface";
import { countries } from "../../utils/constants/countries.enum";

const campaignSchema = new Schema<ICampaign>(
  {
    campaignName: { type: String, required: true, unique: true, trim: true },
    campaignPhotoURL: {
      type: String,
      validate: validator.isURL,
      required: true,
    },
    startPeriod: { type: Date, default: Date.now() },
    endPeriod: { type: Date, required: true },
    // campaignCountries: [{ type: String, enum: countries }],

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

const Campaign = model<ICampaign>("Campaign", campaignSchema);
export default Campaign;
