import React, { useState } from 'react';
import './style.scss';
import { Divider, Grid, IconButton, Typography, Button } from '@mui/material';


function StarRatingReview() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleHoverRatingChange = (newRating) => {
    setHoverRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleStarHover = (star) => {
    handleHoverRatingChange(star);
  };

  const handleStarLeave = () => {
    handleHoverRatingChange(0);
  };

  const handleSubmit = () => {
    
    console.log(`Rating: ${rating}, Review: ${review}`);
    
  };

  return (


    <Grid className='rate'>
    {/* first box */}
    <Grid height='70vh' className='top'>
      <Typography height='60vh' className='heading'>
        Review
      </Typography>
    </Grid>
    {/* first box end  */}



    <div className="star-rating-review">
      <h2>Rate and Review</h2>
      <div className="star-rating">
        {/* <p>Rating: {hoverRating || rating} stars</p> */}
        
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              onClick={() => handleRatingChange(star)}
              className={star <= (hoverRating || rating) ? 'star-filled' : 'star-empty'}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <h3>Give Feedback (Optional)</h3>
      <textarea
        placeholder="Write your review..."
        value={review}
        onChange={handleReviewChange}
        rows={4}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>

    </Grid>
  );
}

export default StarRatingReview;
