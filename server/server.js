import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// Database + Cloudinary
await connectDB();
connectCloudinary();

// Middleware
app.use(cors());

// Webhooks first (raw body if Stripe)
app.post("/clerk", express.json(), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// JSON parser for regular routes
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
