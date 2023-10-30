import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import IContact from "./Contact.interface";

const contactSchema = new Schema<IContact>(
  {
    contact: {
      contactNo: { type: String, required: true },
      isActive: { type: Boolean, default: true },
    },
    postBy: {
      name: String,
      email: String,
      moreAboutUser: { type: Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

const Contact = model<IContact>("Contact", contactSchema);
export default Contact;
