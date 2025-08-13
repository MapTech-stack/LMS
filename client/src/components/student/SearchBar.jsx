import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";

const SearchBar = ({ data }) => {
  const { navigate } = useAppContext();

  const [input, setInput] = useState(data ? data : "");
  const isCourseList = location.pathname.includes("/course-list");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
  return (
    <form
      onSubmit={onSearchHandler}
      className={`flex items-center   w-full md:h-12 h-10 bg-white border border-borderClr rounded justify-center ${
        !isCourseList ? "mx-auto max-w-xl" : "mx-0 max-w-lg"
      } `}>
      <img
        src={assets.search_icon}
        alt="search icon"
        className="w-10 md:auto px-3"
      />

      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="search for courses"
      required
        className="w-full h-full outline-none text-inputClr"
      />
      <button
        type="submit"
        className=" md:px-10 px-7 md:py-3 py-2 text-white bg-accent rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
