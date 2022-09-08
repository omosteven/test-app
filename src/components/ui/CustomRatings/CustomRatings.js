import React from 'react';
import { Rating } from 'react-simple-star-rating'

const CustomRatings = ({rating, handleRating}) => {
  return (
      <Rating onClick={handleRating} ratingValue={rating} className='w-100' /* Available Props */ />
  )
};

export default CustomRatings;