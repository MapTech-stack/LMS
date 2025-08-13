import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-footerClr px-4  sm:px-10 md:px-14 lg:px-36 text-left mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        {/* col 1 */}
        <div className="flex flex-col md:items-start items-center w-full ">
          <img src={assets.logo_dark} alt="Logo" />
          <p className="mt-10 text-center md:text-left text-sm text-white/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            vel expedita veritatis eligendi voluptate inventore et ipsum
            corrupti aliquid officiis dolorem rem odio nesciunt molestiae nam
            aut, esse nihil enim.
          </p>
        </div>
        {/* col 2 */}
        <div className="flex flex-col items-center md:items-start w-full ">
          <h2 className="text-white font-semibold mb-5">Company</h2>
          <ul className=" flex md:flex-col w-full justify-between text-sm text-white/60 md:space-y-2 ">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* col 3 */}
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your eamail"
              className=" border border-primary/30 bg-heading text-primary placeholder-primary outline-none w-64 h-9 rounded px-2 text-sm  "
            />
            <button className="bg-accent w-24 h-9 text-white rounded">
              Subcribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-white/60 py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Edemy. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
