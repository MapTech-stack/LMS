import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Listen for successful connection
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connection successful");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    // Connect without deprecated options
    await mongoose.connect(`${process.env.MONGODB_URI}/MapVisTech-Academys`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // exit process on failure
  }
};

export default connectDB;
