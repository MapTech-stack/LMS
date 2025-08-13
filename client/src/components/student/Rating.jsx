import React, { useEffect, useState } from "react";

const Rating = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);

  // create function to handle the rating
  const handleRating = (value) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors duration-200 focus:outline-none ${
              starValue <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => handleRating(starValue)}
            tabIndex={0}>
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
