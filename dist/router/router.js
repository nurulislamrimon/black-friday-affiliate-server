"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("../modules/user.module/user.router"));
const store_router_1 = __importDefault(require("../modules/store.module/store.router"));
const brand_router_1 = __importDefault(require("../modules/brand.module/brand.router"));
const category_router_1 = __importDefault(require("../modules/category.module/category.router"));
const post_router_1 = __importDefault(require("../modules/post.module/post.router"));
const carousel_router_1 = __importDefault(require("../modules/carousel.module/carousel.router"));
const Contact_router_1 = __importDefault(require("../modules/Contact.module/Contact.router"));
const administrators_router_1 = __importDefault(require("../modules/administrators.module/administrators.router"));
const campaign_router_1 = __importDefault(require("../modules/campaign.module/campaign.router"));
const network_router_1 = __importDefault(require("../modules/network.module/network.router"));
const router = express_1.default.Router();
const routesArray = [
    {
        path: "/user",
        element: user_router_1.default,
    },
    {
        path: "/store",
        element: store_router_1.default,
    },
    {
        path: "/brand",
        element: brand_router_1.default,
    },
    {
        path: "/category",
        element: category_router_1.default,
    },
    {
        path: "/campaign",
        element: campaign_router_1.default,
    },
    {
        path: "/network",
        element: network_router_1.default,
    },
    {
        path: "/post",
        element: post_router_1.default,
    },
    {
        path: "/carousel",
        element: carousel_router_1.default,
    },
    {
        path: "/contact",
        element: Contact_router_1.default,
    },
    {
        path: "/administrators",
        element: administrators_router_1.default,
    },
];
routesArray.forEach((route) => router.use(route.path, route.element));
exports.default = router;
