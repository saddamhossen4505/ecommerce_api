import mongoose from "mongoose";

// Create mongoDbConnection.
export const mongoDbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log(`MongoDbConnection is successful.`.bgMagenta.black);
  } catch (error) {
    console.log(error.message);
  }
};
