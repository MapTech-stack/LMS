import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useAppContext();

  // create array i will give you an example and you will do the  create for the 'add course', 'my courses', 'student enrolled'

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];
  return (
    isEducator && (
      <div className=" w-16 md:w-64 border-r border-primary min-h-screen text-base py-2 flex flex-col ">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"} // for dashboard link
            className={({ isActive }) =>
              `flex items-center flex-col md:flex-row md:justify-start justify-center py-3.5 md:px-10 ${
                isActive
                  ? "bg-accent/30 border-r-[6px] border-indigo-500/90  "
                  : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
              }`
            }>
            <img src={item.icon} alt={item.name} className="w-5 h-5 mr-2" />
            <p className="hidden md:block text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
