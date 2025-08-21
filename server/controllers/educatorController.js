import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";

import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";

// update role to eductor
export const updateRoleEducator = async (req, res) => {
  try {
    const { userId } = req.auth();
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// To add new course
// export const addCourse = async (req, res) => {
//   try {
//     const { courseData } = req.body;
//     const imageFile = req.file;
//     const educatorId = req.auth.userId;

//     if (!imageFile) {
//       return res.json({ success: false, message: "Thumbnail not Attached" });
//     }

//     const parsedCourseData = await JSON.parse(courseData);
//     parsedCourseData.educator = educatorId;

//     // Save the course to the database
//     const newCourse = await Course.create(parsedCourseData);
//     const imageUpload = await cloudinary.uploader.upload(imageFile.path);
//     newCourse.courseThumbnail = imageUpload.secure_url;
//     await newCourse.save();

//     res.json({ success: true, message: "Course added successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


export const addCourse = async (req, res) => {
  try {
    const { userId: educatorId } = req.auth();  // ✅ Corrected
    const { courseData } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not Attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Upload image first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    // Save course
    await Course.create(parsedCourseData);

    res.json({ success: true, message: "Course added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//  to get all course of an educator

export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const Courses = await Course.find({ educator: userId });
    res.json({ success: true, Courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// to get all the educator dashboard data

export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const courses = await Course.find({ educator: userId });

    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    // to calculate total earning from purchases

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });
    const totalEarning = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // collect unique enrolled student IDS with their course title
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
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,

      dashboardData: {
        totalCourses,
        totalEarning,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate(
      "enrolledStudents",
      "name imageUrl"
    );
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, enrolledStudents: course.enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get enrolled students Data with purchase data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const courses = await Course.find({ educator: userId });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseTitle,
      purchaseData: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
