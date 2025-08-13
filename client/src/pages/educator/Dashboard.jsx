import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const { currency } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data here
  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      {/* Render your dashboard components here */}

      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center ">
          <div className="flex items-center gap-3 custom-shadow border border-accent p-4 w-60 rounded-md ">
            <img src={assets.patients_icon} alt="patients" />
            <div>
              <div className="text-xl font-medium text-primary">
                {dashboardData.enrolledStudentsData ? dashboardData.enrolledStudentsData.length : 0}
              </div>
              <div className="text-base text-primary">Total Enrollments</div>
            </div>
          </div>

          {/* col 2 */}

          <div className="flex items-center gap-3 shadow-card border border-accent p-4 w-60 rounded-md">
            <img src={assets.appointments_icon} alt="patients" />
            <div>
              <div className="text-2xl font-medium text-primary">
                {dashboardData.enrolledStudentsData ? dashboardData.enrolledStudentsData.length : 0}
              </div>
              <div className="text-base text-primary">Total Enrollments</div>
            </div>
          </div>

          <div className="flex items-center gap-3 custom-shadow border border-accent p-4 w-60 rounded-md">
            <img src={assets.earning_icon} alt="patients" />
            <div>
              <div className="text-2xl font-medium text-primary">
                {currency} {dashboardData.totalEarnings ?? 0}
              </div>
              <div className="text-base text-primary">Total Earnings</div>
            </div>
          </div>
        </div>

        {/* for the table */}
        <div>
          <h2 className="pb-4 text-lg font-medium">Lastest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-primary/20 ">
            <table className="table-fixed md:table-auto w-full overflow-hidden ">
              <thead className="text-primary border-b border-primary/20 text-sm text-left ">
                <tr>
                  <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Students Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-primary ">
                {dashboardData.enrolledStudentsData && dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="border-b border-primary/20 ">
                    <td className="px-2 md:px-4 items-center hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-2 md:px-4 py-3 flex items-center space-x-3">
                      <img
                        src={item.student?.imageUrl}
                        alt="profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student?.name}</span>
                    </td>

                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
