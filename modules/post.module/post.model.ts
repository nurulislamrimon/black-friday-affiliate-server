import { Schema, model } from "mongoose";
import IPost from "./post.interface";
import { Types } from "mongoose";
import validator from "validator";
import { countries } from "../../utils/constants/countries.enum";

const postSchema = new Schema<IPost>(
  {
    postTitle: String,
    postPhotoURL: { type: String, validate: validator.isURL },
    productPreviewLink: { type: String, validate: validator.isURL },
    expireDate: { type: Date, validate: validator.isDate },
    postType: {
      type: String,
      enum: ["Coupon", "Deal", "Voucher"],
      default: "Coupon",
    },
    dealLink: { type: String, validate: validator.isURL },
    discountPercentage: Number,
    countries: [{ type: String, required: true, enum: countries }],
    couponCode: String,
    postDescription: String,
    isVerified: { type: Boolean, default: false },
    revealed: { type: Number, default: 0 },

    store: {
      type: Types.ObjectId,
      required: true,
      ref: "Store",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    campaign: {
      type: Types.ObjectId,
      ref: "Campaign",
    },
    network: {
      type: Types.ObjectId,
      ref: "Network",
    },

    postBy: {
      name: String,
      email: String,
      moreAboutUser: Types.ObjectId,
    },
    updateBy: [
      {
        name: String,
        email: String,
        moreAboutUser: Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("validate", async function (next) {
  if (
    (this.postType === "Coupon" && !this.couponCode) ||
    (this.postType === "Coupon" && !this.network)
  ) {
    throw new Error("Please provide a coupon code and Influencer Network!");
  } else if (
    (this.postType === "Voucher" && !this.dealLink) ||
    (this.postType === "Voucher" && !this.network)
  ) {
    throw new Error("Please provide voucher link and Influencer Network!");
  } else if (this.postType === "Deal" && !this.dealLink) {
    throw new Error("Please provide deal link!");
  }
});
const Post = model<IPost>("Post", postSchema);
export default Post;
