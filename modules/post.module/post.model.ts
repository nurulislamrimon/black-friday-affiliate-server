import { Schema, model } from "mongoose";
import IPost from "./post.interface";
import { Types } from "mongoose";
import validator from "validator";
import { countries } from "../../utils/constants/countries.enum";
import { getStoreByStoreNameService } from "../store.module/store.services";
import { getNetworkByNetworkNameService } from "../network.module/network.services";
import { getCategoryByCategoryNameService } from "../category.module/category.services";
import { getBrandByBrandNameService } from "../brand.module/brand.services";
import { getCampaignByCampaignNameService } from "../campaign.module/campaign.services";

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
      storeName: String,
      storePhotoURL: String,
      moreAboutStore: {
        type: Types.ObjectId,
        required: true,
        ref: "Store",
      },
    },
    brand: {
      brandName: String,
      brandPhotoURL: String,
      moreAboutBrand: {
        type: Types.ObjectId,
        ref: "Brand",
      },
    },
    category: {
      categoryName: String,
      moreAboutCategory: {
        type: Types.ObjectId,
        ref: "Category",
      },
    },
    campaign: {
      campaignName: String,
      campaignPhotoURL: String,
      moreAboutCampaign: {
        type: Types.ObjectId,
        ref: "Campaign",
      },
    },
    network: {
      networkName: String,
      moreAboutNetwork: {
        type: Types.ObjectId,
        ref: "Network",
      },
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
  // ================check store and set values======================
  if (!this.store.storeName) {
    throw new Error("Please provide a store name!");
  } else {
    const isStoreExist = await getStoreByStoreNameService(this.store.storeName);
    if (!isStoreExist) {
      throw new Error("Please enter valid store name!");
    } else {
      this.store.moreAboutStore = isStoreExist._id as any;
      this.store.storePhotoURL = isStoreExist.storePhotoURL;
    }
  }
  // ================check brand and set values======================
  if (this.brand?.brandName) {
    const isBrandExist = await getBrandByBrandNameService(this.brand.brandName);
    if (!isBrandExist) {
      throw new Error("Please enter a valid brandName!");
    } else {
      this.brand.moreAboutBrand = isBrandExist._id as any;
      this.brand.brandPhotoURL = isBrandExist.brandPhotoURL;
    }
  }
  // ================check category and set values===================
  if (this.category?.categoryName) {
    const isCategoryExist = await getCategoryByCategoryNameService(
      this.category.categoryName
    );
    if (!isCategoryExist) {
      throw new Error("Please enter a valid categoryName!");
    } else {
      this.category.moreAboutCategory = isCategoryExist._id as any;
    }
  }
  // ================check campaign and set values===================
  if (this.campaign?.campaignName) {
    const isCampaignExist = await getCampaignByCampaignNameService(
      this.campaign.campaignName
    );
    if (!isCampaignExist) {
      throw new Error("Please enter a valid campaignName!");
    } else {
      this.campaign.moreAboutCampaign = isCampaignExist._id as any;
      this.campaign.campaignPhotoURL = isCampaignExist.campaignPhotoURL;
    }
  }
  // ================validate others requirement===================
  // coupon validation-----------------
  if (
    (this.postType === "Coupon" && !this.couponCode) ||
    (this.postType === "Coupon" && !this.network?.networkName)
  ) {
    throw new Error("Please provide a coupon code and Influencer Network!");
  } else if (
    // voucher validation-----------------
    (this.postType === "Voucher" && !this.dealLink) ||
    (this.postType === "Voucher" && !this.network?.networkName)
  ) {
    throw new Error("Please provide dealLink and Influencer Network!");
  } else if (this.postType !== "Deal" && this.network?.networkName) {
    const isNetworkExist = await getNetworkByNetworkNameService(
      this.network?.networkName
    );
    if (!isNetworkExist) {
      throw new Error("Please enter a valid network name!");
    } else {
      this.network.moreAboutNetwork = isNetworkExist._id as any;
    }
  } else if (this.postType === "Deal") {
    // deal validation------------------
    if (
      (!this.postPhotoURL && !this.productPreviewLink) ||
      !this.dealLink ||
      !this.category?.categoryName
    ) {
      throw new Error(
        "Please provide dealLink, categoryName and postPhotoURL or productPreviewLink!"
      );
    } else {
      if (!this.category.categoryName) {
        throw new Error("Please enter a category name!");
      }
    }
  }
});
const Post = model<IPost>("Post", postSchema);
export default Post;
