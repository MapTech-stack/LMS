import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const eductorData = dummyEducatorData;
  const user = useUser();

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 border-b border-primary py-3 ">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-5 text-primary relative">
        <p>Hi {user.user ? user.user.fullName : "developer"}</p>
        {user.user ? (
          <UserButton />
        ) : (
          <img
            src={assets.profile_img}
            alt="Profile image"
            className="max-w-8"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
