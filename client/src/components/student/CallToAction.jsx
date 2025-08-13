import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center  gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl  text-heading font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="sm:text-sm text-primary ">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam aliqua proident excepteur commodo do ea.
      </p>

      <div className="flex items-center gap-6 text-medium">
        <button className="px-4 py-2 bg-accent rounded-md text-white outline-none">
          Get Started
        </button>
        <button className="flex items-center gap-2">
          Learn More{" "}
          <img src={assets.arrow_icon} alt="arrow Icon" className="w-3" />{" "}
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
