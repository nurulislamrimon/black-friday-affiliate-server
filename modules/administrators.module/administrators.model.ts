import { Schema, model } from "mongoose";
import validator from "validator";
import IAdministrators from "./administrators.interface";

const administratorsSchema = new Schema<IAdministrators>(
  {
    email: { type: String, required: true, validate: validator.isEmail },
    role: {
      type: String,
      enum: {
        values: ["super-admin", "admin", "manager", "inactive"],
        message: `{VALUE} is not a valid role!`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Administrators = model<IAdministrators>(
  "Administrators",
  administratorsSchema
);
export default Administrators;
