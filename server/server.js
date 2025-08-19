// 1️⃣ Remove Next.js API config (not needed for Express/serverless)

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebHooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// 2️⃣ connect to database
(async () => {
  await connectDB();
  await connectCloudinary();
})();
// 2️⃣ connect to database BEFORE handling requests
await connectDB();
await connectCloudinary();
app.post("/clerk", express.json(), clerkWebhooks); // Clerk can use JSON
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks); // Stripe needs raw body

// 5️⃣ Global middlewares (after webhooks)
app.use(express.json()); 
app.use(clerkMiddleware()); // Clerk middleware for protected routes

// 6️⃣ Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// 7️⃣ Server
import serverless from "serverless-http";

export default serverless(app);
