import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const { user } = useUser();
  const currency = import.meta.env.VITE_CURRENCY;

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // fetch all courses
  const fetchAllCouses = async () => {
    setAllCourses(dummyCourses);
  };

  // fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCouses();
    fetchUserEnrolledCourses();
  }, []);

  const logToken = async () => {
    const token = await getToken();
    console.log("User Token:", token);
  };

  // Check if user is an educator
  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  //Function to calculate average rating of courrse
  const calculateAverageRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return (totalRating / course.courseRatings.length).toFixed(1);
  };

  // funtion to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { unit: ["h", "m"] });
  };

  // Function to calculate total course time
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { unit: ["h", "m"] });
  };

  //function to get nummbers of lecture in a course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });

    return totalLectures;
  };

  const value = {
    navigate,
    currency,
    allCourses,
    calculateAverageRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateNoOfLectures,

    calculateCourseDuration,
    fetchUserEnrolledCourses,
    enrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
