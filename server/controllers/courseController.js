import Course from "../models/Course.js";

// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"]) // exclude heavy/private fields
      .populate({ path: "educator", select: "name email" }); // only return safe educator fields

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get course by id
export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({
      path: "educator",
      select: "name email", // only safe fields
    });

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, course: courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
