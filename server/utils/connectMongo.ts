import mongoose from "mongoose";

export default async () => {
   mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log("Conect to mongo db");
  })
  .catch((err) => {
    console.log("Conect Regected", err);
  });
}

