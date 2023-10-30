import { Types } from "mongoose";
import Carousel from "./carousel.model";

//== get a carousel
export const getCarouselService = async (project: string) => {
  const result = await Carousel.findOne({}, project);
  return result;
};
//== create new carousel
export const addNewCarouselService = async (carousel: object) => {
  const result = await Carousel.create(carousel);
  return result;
};
//== update carousel
export const updateCarouselByIdService = async (
  id: Types.ObjectId,
  carousel: object
) => {
  const result = await Carousel.findByIdAndUpdate(id, { $set: carousel });
  return result;
  // return carousel;
};
