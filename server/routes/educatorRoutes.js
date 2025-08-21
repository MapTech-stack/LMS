import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudents,
  updateRoleEducator,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middleware/authmiddlewares.js";

const educatorRouter = express.Router();

// Add educator role route
educatorRouter.get("/update-role", updateRoleEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

// to get all courses for an educator

educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudents);
export default educatorRouter;
