import mongoose from "mongoose";

// connect to the mongodb database

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection successful");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/MapVisTech-Academys`);
};

export default connectDB;
