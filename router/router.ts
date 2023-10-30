import express from "express";
import userRouter from "../modules/user.module/user.router";
import storeRouter from "../modules/store.module/store.router";
import brandRouter from "../modules/brand.module/brand.router";
import categoryRouter from "../modules/category.module/category.router";
import postRouter from "../modules/post.module/post.router";
import carouselRouter from "../modules/carousel.module/carousel.router";
import contactRouter from "../modules/Contact.module/Contact.router";
import administratorRouter from "../modules/administrators.module/administrators.router";
import CampaignRouter from "../modules/campaign.module/campaign.router";
import networkRouter from "../modules/network.module/network.router";

const router = express.Router();
const routesArray = [
  {
    path: "/user",
    element: userRouter,
  },
  {
    path: "/store",
    element: storeRouter,
  },
  {
    path: "/brand",
    element: brandRouter,
  },
  {
    path: "/campaign",
    element: CampaignRouter,
  },
  {
    path: "/category",
    element: categoryRouter,
  },
  {
    path: "/network",
    element: networkRouter,
  },
  {
    path: "/post",
    element: postRouter,
  },
  {
    path: "/carousel",
    element: carouselRouter,
  },
  {
    path: "/contact",
    element: contactRouter,
  },
  {
    path: "/administrators",
    element: administratorRouter,
  },
];

routesArray.forEach((route) => router.use(route.path, route.element));

export default router;
