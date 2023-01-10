import React from "react";
import { Rating } from "react-simple-star-rating";
import "./CustomRatings.scss";

const CustomRatings = ({ rating, handleRating, otherClass }) => {
    return (
        <Rating
            onClick={handleRating}
            ratingValue={rating}
            className={`w-100 custom__rating ${
                otherClass ? otherClass : ""
            }`} /* Available Props */
        />
    );
};

export default CustomRatings;
