import { clerkClient } from "@clerk/express";
import Course from "../models/course.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";

// Update user role to educator
export const UpdateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Course thumbnail is required" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get each educator courses

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator dashboard data ( Total enarning, enrolled students, number of courses)

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    // to calculate total earning we need id of each courses

    const courseId = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseId },
      status: "completed",
    });

    const totalEarning = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // collect unique enrolled students IDS with rheir course title
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.title,
          student,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: { totalCourses, totalEarning, enrolledStudentsData },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrolled students with purchase data

export const getEnrolledStudentData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator }); // To get all the courses created by an educator

    const courseId = courses.map((course) => course._id); // To get list of all course IDS

    const purchases = await Purchase.find({
      courseId: { $in: courseId },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle"); // To get all the purchases made by students for those courses
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    res.status(200).json({ success: true, enrolledStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
