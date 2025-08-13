import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const [studentsEnrolledData, setStudentsEnrolledData] = useState(null);

  const fetchStudentsEnrolled = async () => {
    setStudentsEnrolledData(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchStudentsEnrolled();
  }, []);

  return studentsEnrolledData ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-primary/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-primary border-b border-primary/20 text-left text-sm">
            <tr className="text-primary">
              <th className=" px-4 py-3 font-semibold text-center hidden sm:table-cell ">
                #
              </th>
              <th className="px-2 py-2 font-semibold">Student Name</th>
              <th className="px-2 py-2 font-semibold">Course Title</th>
              <th className="px-2 py-2 font-semibold hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {studentsEnrolledData.map((item, index) => (
              <tr key={index} className="border-b border-primary/20 ">
                <td className="px-4 py-3 text-center hidden sm:table-cell ">
                  {index + 1}
                </td>
                <td className="px-2 md:px-4 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt="course Thumbnail"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="truncate ">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
