import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  UpdateRoleToEducator,
  getEnrolledStudentData,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middleware/authmiddleware.js";

const educatorRouter = express.Router();

// add educator role route
educatorRouter.get("/update-role", UpdateRoleToEducator);

educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addCourse
);

educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentData
);

export default educatorRouter;
