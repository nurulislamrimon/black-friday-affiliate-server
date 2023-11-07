import { Schema, model } from "mongoose";
import validator from "validator";
import { Types } from "mongoose";
import IBrand from "./brand.interface";
import { countries } from "../../utils/constants/countries.enum";

const brandSchema = new Schema<IBrand>(
  {
    brandName: { type: String, required: true, unique: true, trim: true },
    brandPhotoURL: { type: String, validate: validator.isURL, required: true },
    brandLink: { type: String },
    brandDescription: String,
    brandCountries: [{ type: String, enum: countries }],
    howToUse: [
      [
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          photoURL: { type: String, validate: validator.isURL },
          content: String,
        },
      ],
    ],

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

const Brand = model<IBrand>("Brand", brandSchema);
export default Brand;
