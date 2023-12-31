import { Schema, model } from "mongoose";
import validator from "validator";
import { Types } from "mongoose";
import ICategory from "./category.interface";
import { countries } from "../../utils/constants/countries.enum";

const categorySchema = new Schema<ICategory>(
  {
    categoryName: { type: String, required: true, unique: true, trim: true },
    // categoryCountries: [{ type: String, enum: countries }],

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

const Category = model<ICategory>("Category", categorySchema);
export default Category;
