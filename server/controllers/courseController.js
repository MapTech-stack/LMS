import Course from "../models/course.js";

// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get course by Id
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    // Check if courseData and courseContent exist
    if (!courseData || !courseData.courseContent) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // remove lecture url if isPreview is false
    if (Array.isArray(courseData.courseContent)) {
      courseData.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => {
            if (!lecture.isPreview) {
              lecture.lectureUrl = "";
            }
          });
        }
      });
    }
    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
