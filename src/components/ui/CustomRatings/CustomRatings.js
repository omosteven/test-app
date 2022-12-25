import React from "react";
import { Rating } from "react-simple-star-rating";
import "./CustomRatings.scss";

const CustomRatings = ({ rating, handleRating }) => {
    return (
        <Rating
            onClick={handleRating}
            ratingValue={rating}
            className='w-100 custom__rating' /* Available Props */
        />
    );
};

export default CustomRatings;
