import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useAppContext();
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
          
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative px-8 md:px-36 pt-20  text-left mb-30">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full ">
          <div>
            <h1 className="text-3xl font-semibold text-heading">Course List</h1>
            <p className="text-primary">
              <span
                className="text-accent cursor-pointer"
                onClick={() => navigate("/")}>
                Home
              </span>
              / <span>Course List</span>
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {/* remove filter */}

        {input && (
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent rounded mt-8 -mb-8 text-primary">
            <p className="text-primary">{input}</p>
            <img
              onClick={() => navigate("/course-list")}
              src={assets.cross_icon}
              alt=""
              className=" cursor-pointer "
            />
          </div>
        )}

        <div className="grid grid-cols-auto2 gap-5 mt-8   md:mt-25 ">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoursesList;
