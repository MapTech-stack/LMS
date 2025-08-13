import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between text-left w-full px-8 border-t ">
      <div className="flex items-center gap-2 ">
        <img src={assets.logo} alt="Logo" className="hidden md:block w-20 " />
        <div>
          <p className="text-sm text-gray-500">
            © 2023 Your Company. All rights reserved.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start mt-4 md:mt-0">
        <p className="text-sm text-gray-500">Follow us on:</p>
        <div className="flex gap-4 mt-2">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <img src={assets.facebook_icon} alt="Facebook" />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <img src={assets.twitter_icon} alt="Twitter" />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <img src={assets.instagram_icon} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
