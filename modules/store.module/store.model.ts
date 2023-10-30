import { Schema, model } from "mongoose";
import IStore from "./store.interface";
import validator from "validator";
import { Types } from "mongoose";
import { countries } from "../../utils/constants/countries.enum";

const storeSchema = new Schema<IStore>(
  {
    storeName: { type: String, required: true },
    // storePhotoURL: { type: String, validate: validator.isURL, required: true },
    storeLink: { type: String, required: true },
    countries: [{ type: String, required: true, enum: countries }],
    countriesFlag: [{ type: String }],
    storeDescription: String,
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

const Store = model<IStore>("Store", storeSchema);
export default Store;
