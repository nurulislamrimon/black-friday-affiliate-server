export const post_query_fields = [
  "_id",
  "postTitle",
  "storeName",
  "store._id",
  "postType",
  "countries",
  "createdAt",
  "expireDate",
];
export const store_query_fields = [
  "_id",
  "storeName",
  "postType",
  "countries",
  "createdAt",
];
export const brand_query_fields = [
  "_id",
  "brandName",
  "postType",
  "countries",
  "createdAt",
];
export const campaign_query_fields = [
  "_id",
  "campaignName",
  "postType",
  "countries",
  "createdAt",
];
export const category_query_fields = ["_id", "categoryName"];

export const network_query_fields = ["_id", "networkName"];

export const user_query_fields = [
  "_id",
  "name",
  "email",
  "country",
  "isVerified",
  "role",
  "createdAt",
];

export const exclude_fields = [
  "createdAt",
  "expireDate",
  "_id",
  "isVerified",
  "store._id",
];
