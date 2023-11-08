import { Types } from "mongoose";
import Post from "./post.model";
import User from "../user.module/user.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { post_query_fields } from "../../utils/constants";
import { getAllStores } from "../store.module/store.services";

//== get search client
export const searchGloballyClientService = async (query: object) => {
  const stores = await getAllActiveStores(query);
  const posts = await getAllPosts(query, true);
  return { stores, posts };
};

//== get search admin
export const searchGloballyAdminService = async (query: object) => {
  const stores = await getAllStores(query);
  const posts = await getAllPosts(query, false);
  return { stores, posts };
};

//== get Post by name
export const getPostByPostTitleService = async (postTitle: string) => {
  const result = await Post.findOne({ postTitle: postTitle });
  return result;
};

//== get Post by objectId
export const getPostByIdService = async (id: Types.ObjectId) => {
  const result = await Post.findOne({ _id: id }, { postBy: 0, updateBy: 0 });
  return result;
};

//== create new Post
export const addNewPostService = async (post: object) => {
  const result = await Post.create(post);
  await setPostAsUnreadToUserService(result._id);
  return result;
};

//== add post as unread to all verified users
export const setPostAsUnreadToUserService = async (postId: Types.ObjectId) => {
  const result = await User.updateMany(
    { isVerified: true },
    { $push: { newPosts: { moreAboutPost: postId } } }
  );
  return result;
};

//== update a Post
export const updateAPostService = async (
  PostId: Types.ObjectId,
  newData: any
) => {
  // add updator info
  let { updateBy, existPost, ...updateData } = newData;

  updateBy = { ...existPost.updateBy, ...updateBy };

  const result = await Post.findByIdAndUpdate(
    PostId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true, new: true }
  );

  return result;
};

//== update a Post
export const revealedAPostService = async (PostId: Types.ObjectId) => {
  const result = await Post.updateOne(
    { _id: PostId },
    { $inc: { revealed: 1 } }
  );

  return result;
};

export const getAllPosts = async (query: any, isActivePostOnly: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("post", query, ...post_query_fields) as any;

  // set expiredate to show only active post
  const validityCheck = {
    expireDate: { $gt: new Date() },
  };
  // client side only
  isActivePostOnly && filters.$and.push(validityCheck);

  const result = await Post.find(filters)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const totalDocuments = await Post.countDocuments(filters);
  return {
    meta: {
      page,
      limit,
      totalDocuments: totalDocuments,
    },
    data: result,
  };
};

//== delete a Post
export const deleteAPostService = async (PostId: Types.ObjectId) => {
  const result = await Post.deleteOne({ _id: PostId });
  return result;
};

//== delete a Post
export const deleteManyPostService = async (PostId: Types.ObjectId[]) => {
  const result = await Post.deleteMany({ _id: PostId });
  return result;
};

// ===========================based on special ids====================

//== get Post by store Id
export const getPostByStoreIdService = async (storeId: Types.ObjectId) => {
  const result = await Post.find({ store: storeId }).populate("store", {
    storeName: 1,
    storePhotoURL: 1,
  });
  return result;
};

//== get Post by brand Id
export const getPostByBrandIdService = async (brandId: Types.ObjectId) => {
  const result = await Post.find({ brand: brandId }).populate("brand", {
    brandName: 1,
    brandPhotoURL: 1,
  });
  return result;
};

//== get Post by campaign Id
export const getPostByCampaignIdService = async (
  campaignId: Types.ObjectId
) => {
  const result = await Post.find({ campaign: campaignId }).populate(
    "campaign",
    {
      campaignName: 1,
      campaignPhotoURL: 1,
    }
  );
  return result;
};

//== get Post by brand Id
export const getPostByCategoryIdService = async (
  categoryId: Types.ObjectId
) => {
  const result = await Post.find({ category: categoryId }).populate(
    "category",
    {
      categoryName: 1,
    }
  );
  return result;
};

//== get Post by brand Id
export const getPostByNetworkIdService = async (networkId: Types.ObjectId) => {
  const result = await Post.find({ network: networkId }).populate("network", {
    networkName: 1,
  });
  return result;
};

// update countries to all related fields
// export const createNewPostUpdateCountriesToAllRelatedFields = async (
//   payload: IPost,
//   session: mongoose.mongo.ClientSession
// ) => {
//   const postCountries = payload.countries;

//   await Store.findOneAndUpdate(
//     { _id: payload.store.moreAboutStore },
//     { $addToSet: { storeCountries: { $each: postCountries } } },
//     { upsert: true, new: true, session }
//   );

//   if (payload.brand?.moreAboutBrand) {
//     await Brand.findOneAndUpdate(
//       { _id: payload.brand.moreAboutBrand },
//       { $addToSet: { brandCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }

//   if (payload.category?.moreAboutCategory) {
//     await Category.findOneAndUpdate(
//       { _id: payload.category.moreAboutCategory },
//       { $addToSet: { categoryCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }

//   if (payload.campaign?.moreAboutCampaign) {
//     await Campaign.findOneAndUpdate(
//       { _id: payload.campaign.moreAboutCampaign },
//       { $addToSet: { campaignCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }

//   if (payload.network?.moreAboutNetwork) {
//     await Network.findOneAndUpdate(
//       { _id: payload.network.moreAboutNetwork },
//       { $addToSet: { networkCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }
// };
