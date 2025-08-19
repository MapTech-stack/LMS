import mongoose from "mongoose";

// connect to the mongodb database

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection successful");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/MapVisTech-LMS`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
