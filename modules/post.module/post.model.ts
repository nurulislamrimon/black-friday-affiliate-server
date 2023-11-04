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
  if (!this.store.storeName) {
    throw new Error("Please provide a store name!");
  } else {
    const isStoreExist = await getStoreByStoreNameService(this.store.storeName);
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
    if (!isStoreExist) {
      throw new Error("Please enter valid store name!");
    } else {
      this.store.moreAboutStore = isStoreExist._id as any;
      this.store.storePhotoURL = isStoreExist.storePhotoURL;
      if (
        (this.postType === "Coupon" && !this.couponCode) ||
        (this.postType === "Coupon" && !this.network?.networkName)
      ) {
        throw new Error("Please provide a coupon code and Influencer Network!");
      } else if (
        (this.postType === "Voucher" && !this.dealLink) ||
        (this.postType === "Voucher" && !this.network?.networkName)
      ) {
        throw new Error("Please provide voucher link and Influencer Network!");
      } else if (this.network?.networkName) {
        // for coupon and voucher network
        const isNetworkExist = await getNetworkByNetworkNameService(
          this.network?.networkName
        );
        if (!isNetworkExist) {
          throw new Error("Please enter a valid network name!");
        } else {
          this.network.moreAboutNetwork = isNetworkExist._id as any;
          next();
        }
      } else if (this.postType === "Deal") {
        // for products
        if (
          (!this.postPhotoURL && !this.productPreviewLink) ||
          !this.dealLink ||
          !this.category?.categoryName
        ) {
          throw new Error(
            "Please provide dealLink, categoryName and postPhotoURL or productPreviewLink!"
          );
        } else {
          const isCategoryExist = await getCategoryByCategoryNameService(
            this.category.categoryName
          );
          if (!isCategoryExist) {
            throw new Error("Please enter a valid category name!");
          } else {
            this.category.moreAboutCategory = isCategoryExist._id as any;
            if (this.brand?.brandName) {
              const isBrandExist = await getBrandByBrandNameService(
                this.brand.brandName
              );
              if (!isBrandExist) {
                throw new Error("Please enter a valid brand name!");
              } else {
                this.brand.moreAboutBrand = isBrandExist._id as any;
                this.brand.brandPhotoURL = isBrandExist.brandPhotoURL;
              }
              next();
            }
          }
        }
      }
    }
  }
});
const Post = model<IPost>("Post", postSchema);
export default Post;
