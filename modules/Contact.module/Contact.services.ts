import { Types } from "mongoose";
import Contact from "./Contact.model";

//== get a Contact
export const getContactService = async (project: string) => {
  const result = await Contact.findOne({ "contact.isActive": true }, project);
  return result;
};
//== create new Contact
export const addNewContactService = async (payload: object) => {
  const result = await Contact.create(payload);
  return result;
};
//== update Contact
export const updateActiveContactToInactiveService = async () => {
  const result = await Contact.updateMany(
    { "contact.isActive": true },
    {
      $set: { "contact.isActive": false },
    }
  );
  return result;
};
