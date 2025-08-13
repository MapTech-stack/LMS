import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateAverageRating } = useAppContext();

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-primary/30 pb-6 overflow-hidden rounded-lg">
      {/* course image */}
      <img src={course.courseThumbnail} alt="image" className="w-full" />

      {/* rating deatils */}
      <div className="px-2.5 text-left">
        <h3 className="text-sm font-semibold mt-3">{course.courseTitle}</h3>
        <p className="text-primary ">Mustapha Abiodun</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          {/* average rating */}
          <p>{calculateAverageRating(course)}</p>
          {/* Star Rating */}
          <div className="flex ">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateAverageRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="Star rating"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          {/* Total Nummber of rating */}
          <p className="text-primary"> {course.courseRatings.length} </p>
        </div>

        {/* End of Rating */}

        {/* course Price */}
        <p className="text-base font-semibold text-heading ">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
