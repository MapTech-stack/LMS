import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col text-center justify-center w-full md:pt-15 pt-15 px-7 md:px-0 space-y-7  bg-gradient-to-b from-cyan-100/70 ">
      <h1 className="text-home-heading-small md:text-home-heading-large  text-balance  relative font-bold text-heading max-w-4xl mx-auto ">
        Empower your future with the courses designed to <span className=" text-secondary">fit your choice.</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className=" hidden md:block absolute -bottom-7  right-0 "
        />
      </h1>
      <p className="hidden md:block text-primary max-w-2xl mx-auto">
        We bring together world-class instructors, interactive content, and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>
      <p className="md:hidden max-w-sm mx-auto text-primary">
        We bring together world-class instructors to help you achieve your
        professional goals.
      </p>

      <SearchBar />
    </div>
  );
};

export default Hero;
