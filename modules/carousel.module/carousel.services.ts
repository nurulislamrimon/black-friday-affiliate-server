import { Types } from "mongoose";
import Carousel from "./carousel.model";

//== get a carousel by country
export const getCarouselByCountryService = async (countryName: string) => {
  const result = await Carousel.findOne({ country: countryName });
  return result;
};

//== get a carousel by id
export const getCarouselByIdService = async (carouselId: Types.ObjectId) => {
  const result = await Carousel.findOne({ _id: carouselId });
  return result;
};

//== get all carousel
export const getCarouselService = async () => {
  const result = await Carousel.find({}, "-postBy -updateBy");
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
  payload: any
) => {
  // add updator info
  let { updateBy, existCarousel, ...updateData } = payload;

  updateBy = { ...existCarousel.updateBy, ...updateBy };

  const result = await Carousel.updateOne(
    { _id: id },
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true }
  );

  return result;
};

//==delete a carousel
export const deleteCarouselService = async (carouselId: Types.ObjectId) => {
  const result = await Carousel.deleteOne({ _id: carouselId });
  return result;
};
