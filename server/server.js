import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// connect to database
await connectDB();
await connectCloudinary();

// middleware
app.use(cors());

// ✅ Webhooks first (no auth)
app.post("/clerk", express.json(), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ✅ Then JSON body parser for normal routes
app.use(express.json());

// ✅ Then Clerk middleware for authenticated routes
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
