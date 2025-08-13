import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const isCoureListPage = location.pathname.includes("/course-list");

  const { navigate, isEducator, setIsEducator } = useAppContext();

  const { openSignIn } = useClerk();
  const { user } = useUser();
  return (
    <div
      className={`flex justify-between items-center py-4 px-4  sm:px-10 md:px-14 lg:px-40 border-b border-gray-500 ${
        isCoureListPage ? "bg-white" : "bg-cyan-100/70"
      } `}>
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex gap-5 items-center">
          {user && (
            <>
              <button
                onClick={() => navigate("/educator")}
                className="cursor-pointer">
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>

        {/* if user is signed in we use userButton */}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-full">
            Create Acoount
          </button>
        )}
      </div>

      {/* mobile Navbar */}
      <div className="md:hidden flex items-center gap-2 sm-gap-5 text-gray-500 ">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs  ">
          {user && (
            <>
              <button
                onClick={() => navigate("/educator")}
                className="cursor-pointer">
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        <button className=" cursor-pointer " onClick={() => openSignIn()}>
          {user ? <UserButton /> : <img src={assets.user_icon} alt="" />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
