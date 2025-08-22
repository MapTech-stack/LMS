import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

// Update role to educator
export const updateRoleEducator = async (req, res) => {
  try {
    const { userId } = req.auth();
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a course
export const addCourse = async (req, res) => {
  try {
    const { userId: educatorId } = req.auth();
    const { courseData } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Upload thumbnail to Cloudinary
    const imageUpload = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) return res.status(500).json({ success: false, message: error.message });

        parsedCourseData.courseThumbnail = result.secure_url;
        const newCourse = await Course.create(parsedCourseData);
        res.json({ success: true, message: "Course added successfully", course: newCourse });
      }
    );

    imageUpload.end(imageFile.buffer);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all courses by educator
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const courses = await Course.find({ educator: userId }).lean();
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Educator dashboard data
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const courses = await Course.find({ educator: userId }).lean();

    const totalCourses = courses.length;
    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).lean();

    const totalEarning = purchases.reduce((sum, p) => sum + p.amount, 0);

    const enrolledStudentsData = [];
    await Promise.all(
      courses.map(async (course) => {
        const students = await User.find(
          { _id: { $in: course.enrolledStudents } },
          "name imageUrl"
        ).lean();

        students.forEach((student) =>
          enrolledStudentsData.push({ courseTitle: course.courseTitle, student })
        );
      })
    );

    res.json({
      success: true,
      dashboardData: { totalCourses, totalEarning, enrolledStudentsData },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get enrolled students
export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("enrolledStudents", "name imageUrl")
      .lean();

    if (!course) return res.json({ success: false, message: "Course not found" });

    res.json({ success: true, enrolledStudents: course.enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
