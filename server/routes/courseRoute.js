import express from "express";
import {
  getAllCourses,
  getCourseById,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", async (req, res, next) => {
  try {
    await getAllCourses(req, res, next);
  } catch (err) {
    next(err);
  }
});
courseRouter.get("/:id", async (req, res, next) => {
  try {
    await getCourseById(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
courseRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default courseRouter;
