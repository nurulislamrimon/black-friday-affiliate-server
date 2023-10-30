import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import validator from "validator";
import ICarousel from "./carousel.interface";

const carouselSchema = new Schema<ICarousel>(
  {
    carousel: [
      {
        photoURL: { type: String, required: true, validate: validator.isURL },
        couponCode: String,
        externalLink: { type: String, validate: validator.isURL },
      },
    ],
    postBy: {
      name: String,
      email: String,
      moreAboutUser: { type: Types.ObjectId, ref: "User" },
    },
    updateBy: [
      {
        name: String,
        email: String,
        moreAboutUser: { type: Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const Carousel = model<ICarousel>("Carousel", carouselSchema);
export default Carousel;
