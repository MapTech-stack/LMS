import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useAppContext();
  return (
    <div className="py-10 md:py-16 px-8 md:px-40">
      <h2 className="text-2xl md:text-3xl font-medium text-heading ">
        Learn from the best
      </h2>
      <p className=" text-sm md:text-base text-primary mt-3  max-w-xl text-balance mx-auto">
        Discover our top-rated courses across various categories. From coding
        and design to business and wellness, our courses are crafted to deliver
        results.
      </p>

      {/* course cards */}
      <div className="grid grid-cols-auto px-4 md:px-0 my-10 md:my-16 gap-4">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-primary border border-primary/30 px-10 py-3 rouned">
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;
