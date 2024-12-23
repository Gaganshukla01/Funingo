import React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import bg3Light from './images/bg3Light.png';
import bg3 from './images/bg3.png';
import './styles.scss';
import { useNavigate } from 'react-router';
import { scrollToBottom } from '../../utils';
import { profile1, profile2, profile3, profile4, profileHeading1, profileHeading2, profileHeading3, profileHeading4 } from '../../assets';


import { heart, loaderGif, bookNow } from "../../assets";
import {scrollToTop} from '../../utils/index';

const corporateData = [
  {
    name: 'meeting',
    heading: profileHeading1,
    main: profile1,
    text: "Funingo Adventure Arena offers and ideal setting for corporate off-sites. Enjoy professional amenities and adventure activities, blending productivity with team bonding in a serene enviroment"
  },
  {
    name: 'incentives',
    heading: profileHeading2,
    main: profile2,
    text: "Reward your team with exciting adventures at Funingo. Our activites and serene enviroment promote positive reinforcement, motivating and recognizing your employees effectively"
  },
  {
    name: 'corporategame',
    heading: profileHeading3,
    main: profile3,
    text: "Enhance team spirit with our team building retreats. Engage in activities that boost collaboration, communication, and leadership, creating a stronger, more cohesive team"
  },
  {
    name: 'corporategame',
    heading: profileHeading4,
    main: profile4,
    text: "Celebrate retirement in style at Funingo Adventure Arena! Enjoy customizable event planning, thrilling activities, and delicious catering options, all set in our unique venue. Make this milestone unforgettable-contact us to plan a retirement party to remember!"
  }
];

const Corporate = () => {
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
    <Grid className='corporate'>
      {/* {First Box} */}
      <Grid height='70vh' className='top'>
        <Typography height='60vh' className='heading'>
          CORPORATE
        </Typography>
      </Grid>

      {corporateData.map((data, i) => (
        <Grid
          key={data.name}
          className='top2'
          mt='70px'
          flexDirection={i % 2 === 0 ? 'row' : 'row-reverse'}
        >
          <img
            src={i % 2 === 0 ? bg3 : bg3Light}
            alt='background-img'
            className='background-corp'
          />
          <Grid className='first'>
            <Box
              component={'img'}
              sx={{ borderRadius: '1px' }}
              className='main-img'
              src={data.main}
              alt={'Corporate Event'}
            />
          </Grid>
          <Grid
            className='second'
            width={{ xs: '95%', md: '40vw' }}
            marginRight={{ md: i % 2 ? '100px' : '0px' }}
          >
            <Grid className='top-box'>
              <img className='heading-img' src={data.heading} alt={'Heading'} />
            </Grid>
            <Grid className='content-box'>
              {data.text}
            </Grid>
            <div className='flex max-sm:justify-center max-sm:items-center'>
              {renderButton()}
            </div>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Corporate;
