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

// initialize Express
const app = express();

// connect to database

await connectDB();

await connectCloudinary();

// middleware
app.use(cors());
app.use(clerkMiddleware()); // Clerk middleware for authentication to become educator
app.use(express.json()); // Middleware to parse JSON requests globally

// routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/clerk", express.json(), clerkWebhooks);

app.use("/api/educator", educatorRouter);

app.use("/api/course", courseRouter);

app.use("/api/user", userRouter);


app.post('/stripe',express.raw({type: 'application/json'}), stripeWebHooks)

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
