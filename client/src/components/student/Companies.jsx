import React from "react";
import { dummyCompanies } from "../../assets/assets";

const Companies = () => {
  return (
    <div className="pt-12">
      <p className="text-base text-primary ">Trusted by learners from</p>
      <div className=" flex flex-wrap items-center justify-center gap-6 gap-y-0  md:gap-16 md:mt-5 mt-3 ">
        {dummyCompanies.map((image, index) => {
          return (
            <img src={image} alt="image" key={index} className="h-12 w-20 md:w-25" />
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
