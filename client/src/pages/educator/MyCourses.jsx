import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useAppContext();
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    // Simulate fetching courses
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]);

  return courses ? (
    <div className="h-screen flex flex-col items-center justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h1 className="pb-4 text-lg font-medium">My Courses</h1>
        {/* Table in a div */}

        <div className=" flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-primary/20 ">
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-primary border-b border-primary/20 text-sm text-left ">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Published On
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-primary">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="Course image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
