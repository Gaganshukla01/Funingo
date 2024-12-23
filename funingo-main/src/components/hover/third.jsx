import React from "react";
import { Divider, Grid, IconButton, Typography, Button } from "@mui/material";
import img1 from "./image/img3.png"
import './third.scss';
import { corporateHoverImage } from "../../assets";
export default function first() {
  return (
      
    <Grid id="third" className="py-10">
      <Grid className="flex justify-center items-center">
        <img 
          src={corporateHoverImage}
          alt="corporate-img"
          className="corporate-hover-image"
        >
          </img>
      </Grid>
  
      <Grid className="zone-hover">
      <Typography className='sub'>CORPORATE OFF-SITES</Typography>


      <Typography className='sub'>POSITIVE REINFORCEMENT</Typography>

      <Typography className='sub'>TEAM BUILDING RETREATS</Typography>

      <Button 
          variant='contained'
          sx={{
            background: '#2CC248',
            boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
            borderRadius: '50px',
            padding: '10px 50px',
            fontFamily: 'Luckiest Guy',
            marginTop: '20px',
            fontSize: '18px',
            '&:hover': {
              background: '#1e8e33'
            },
            height: '50px',
            width: '200px',
          }}
        >
          BOOK NOW
        </Button>
      </Grid>
    </Grid>
    
  )
}
