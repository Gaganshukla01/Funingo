import React from "react";
import { Divider, Grid, IconButton, Typography, Button } from "@mui/material";
import './first.scss';
import img1 from "./image/img2.png";
import { eventHoverImage } from "../../assets";

export default function First() {
  return (
    <Grid id="main">
      <Grid className="flex justify-center items-center w-auto h-auto">
        <img 
          src={eventHoverImage} 
          className="event-hover-image" 
          alt="eventHoverImage" 
        />
      </Grid>
  
      <Grid className="zone-hover">
        <Typography className='sub' m="1rem">Birthday</Typography>
        <Typography className='sub' m="1rem">Baby Shower</Typography>
        <Typography className='sub' m="1rem">Pre Wedding</Typography>
        <Typography className='sub' m="1rem">Kitty Party</Typography>
        <Button 
          variant='contained'
          sx={{
            background: '#2CC248',
            boxShadow: '0px 2.5px 9px rgba(0, 0, 0, 0.25)',
            borderRadius: '50px',
            padding: '10px 50px',
            fontFamily: 'Luckiest Guy',
            fontSize: '18px',
            marginTop: '20px',
            '&:hover': {
              background: '#1e8e33'
            },
            height: '50px',
            width: '200px',
          }}
        >
          Book Now
        </Button>
      </Grid>
    </Grid>
  );
}
