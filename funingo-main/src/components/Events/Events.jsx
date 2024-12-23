import React from "react";
import { useEffect, useState } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import birthday from "./images/birthday.jpg";
import bg6 from "./images/bg6.png";
import bg4 from "./images/bg4.png";
import bg5 from "./images/bg5.png";
import "./styles.scss";
import { useNavigate } from "react-router";
import birthdayParty from "./images/birthdayParty.png";
import wedding from "./images/gettogether.jpg";
import babyshowerheading from "./images/babyshowerheading.png";
import babyshower from "./images/kittyparty.jpg";
import prewedding from "./images/prewedding.png";
import { scrollToBottom } from "../../utils";

import { heart, loaderGif, bookNow } from "../../assets";


import {scrollToTop} from '../../utils/index';

const eventData = [
  {
    name: "birthday",
    heading: birthdayParty,
    main: birthday,
    bcg: "#FCF892",
    bcImg: bg5,
    marginBottom: "5%",
    content: `At Funingo Adventure Arena, birthdays are more than just celebrations—they're unforgettable adventures! Treat your child to a day filled with excitement and joy as they explore our wide range of thrilling activities, creating memories that will last a lifetime.`,
  },
  {
    name: "babyShower",
    heading: babyshowerheading,
    main: babyshower,
    bcg: "#8AFF77",
    bcImg: bg6,
    marginBottom: "3%",
    content: `Escape the ordinary and indulge in a day of fun and relaxation at Funingo Adventure Arena. Our venue provides the perfect setting for your next kitty party, offering a blend of thrilling adventures and serene surroundings, ensuring a delightful experience for al`,
  },
  {
    name: "preWedding",
    heading: prewedding,
    main: wedding,
    bcg: "#F981C2",
    bcImg: bg4,
    marginBottom: "5%",
    content: `Looking for a venue that offers something unique for 
your next get-together? Look no further than Funingo 
Adventure Arena. Whether you're reconnecting with friends 
or bringing together family, our park offers a diverse range 
of activities and experiences, promising a day filled with 
laughter, joy, and shared memories`,
  },
];

const Events = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const navigate = useNavigate();

  const renderButton = () => (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {navigate('/book');scrollToTop();}}
      style={{ position: 'relative' }}
      className="mt-8 flex max-sm:justify-center max-sm:mt-2"
    >
      <img src={bookNow} className='commonButton' alt="Book Now" />
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: '80%',
            transform: 'translateX(-50%)',
            marginTop: '0px',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'grab',
            color: 'red',
            fontSize: '20px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            zIndex: '1',
          }}
        >
          <img src={loaderGif} className='h-20 w-20' alt="Loader" style={{ marginRight: '-5px' }} />
          <img
            src={heart}
            alt="Heart"
            style={{ width: '15px', height: '15px', position: 'absolute', top: '50%', left: '26%', transform: 'translate(-50%, -50%)' }}
          />
          <span style={{ marginLeft: '0px' }}>Unload Ultimate Fun</span>
        </div>
      )}
    </button>
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Grid className="events">
      {/* first box */}
      <Grid height="70vh" className="top">
        <Typography height="60vh" className="heading">
          EVENTS
        </Typography>
      </Grid>

      {eventData.map((data, i) => (
        <Grid
          key={data.name}
          className="top2"
          flexDirection={i % 2 === 0 ? "row" : "row-reverse"}
          marginBottom={data.marginBottom}
        >
          <img
            src={data.bcImg}
            alt="background-img"
            className="background-event"
          />
          <Grid className="first">
            <Box
              component={"img"}
              sx={{ borderRadius: "10px" }}
              className="main-img"
              src={data.main}
              alt={"Event"}
            />
          </Grid>
          <Grid className="second" marginRight={i % 2 ? "50px" : "0px"}>
            <Grid className="top-box">
              <img
                className="heading-img"
                src={data.heading}
                alt={"Event heading"}
              />
            </Grid>
            <Grid className="content-box">
              <h4>{data.content}</h4>
            </Grid>
            <div className="flex max-sm:justify-center max-sm:items-center">
              {renderButton()}
            </div>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Events;
