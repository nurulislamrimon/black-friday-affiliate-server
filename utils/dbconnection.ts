import mongoose from "mongoose";

export default function dbconnection() {
  mongoose
    .connect(process.env.db_local || "")
    // .connect(process.env.db_remote || "")
    .then(() => console.log("Database connected!"))
    .catch((err) => {
      throw new Error(err);
    });
}
