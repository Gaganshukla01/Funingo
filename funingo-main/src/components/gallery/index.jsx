import React, {useEffect} from 'react';
import { Grid, Typography, Button, useMediaQuery } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Slide1 from './images/sports/slide-1.png';
import Slide2 from './images/sports/slide-2.png';
import Slide3 from './images/sports/slide-3.png';
import Slide4 from './images/sports/slide-4.png';
import Slide5 from './images/sports/slide-5.png';
import Slide6 from './images/sports/bull.jpg';
import Slide7 from './images/sports/climb.jpg';
import Slide8 from './images/sports/high-ropes-course.jpg';
import Slide9 from './images/sports/kids.jpg';
import Slide10 from './images/sports/playground.jpg';

import { Box } from '@mui/material';
import './styles.scss';

const galleryData = [
  {
    title: 'SPORT EVENTS',
    pictures: [
      {
        p1: Slide1,
        p2: Slide2,
        p3: Slide3,
        p4: Slide4,
        p5: Slide7
      },
      {
        p1: Slide6,
        p2: Slide5,
        p3: Slide10,
        p4: Slide8,
        p5: Slide9
      },
      {
        p1: Slide5,
        p2: Slide7,
        p3: Slide1,
        p4: Slide2,
        p5: Slide6
      }
    ]
  },
  {
    title: 'BIRTHDAY PARTIES',
    pictures: [
      {
        p1: Slide1,
        p2: Slide2,
        p3: Slide3,
        p4: Slide4,
        p5: Slide7
      },
      {
        p1: Slide6,
        p2: Slide5,
        p3: Slide10,
        p4: Slide8,
        p5: Slide9
      }
    ]
  },
  {
    title: 'CORPORATE EVENTS',
    pictures: [
      {
        p1: Slide1,
        p2: Slide2,
        p3: Slide3,
        p4: Slide4,
        p5: Slide7
      },
      {
        p1: Slide6,
        p2: Slide5,
        p3: Slide10,
        p4: Slide8,
        p5: Slide9
      }
    ]
  }
];
const Albums = ({ slidesData }) => {
  const { p1, p2, p3, p4, p5 } = slidesData;
  return (
    <Box>
      <Grid
        sx={{
          display: 'flex',
          width: '100%',
          height: '70vh',
          justifyContent: 'center'
        }}
      >
        <Box
          className='left-car-side'
          display={'flex'}
          flexWrap={'wrap'}
          gap={'2%'}
          width={'60%'}
        >
          <img className='left-img-car' src={p1} />
          <img className='left-img-car' src={p2} />

          <img className='left-img-car' src={p3} />
          <img className='left-img-car' src={p4} />
        </Box>
        <Box className='right-car-side' width={'40%'} mx='0px'>
          <img className='right-img-car' src={p5} height='100%' width='100%' />
        </Box>
      </Grid>
    </Box>
  );
};

const Gallery = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Grid className='gallery'>
      <Grid height='70vh' mb={'5vh'} className='top'>
        <Typography height='60vh' className='heading'>
          GALLERY
        </Typography>
      </Grid>

      {galleryData.map((data, idx) => (
        <Grid className='top2' mb={'8vh'} key={idx}>
          <Grid className='carousel-box'>
            <Typography className='subheading'>{data.title}</Typography>
            {!isMobile && (
              <Carousel
                autoPlay={true}
                centerMode={true}
                centerSlidePercentage={100}
                emulateTouch={true}
                infiniteLoop={true}
                interval={1500}
                showArrows={true}
                showStatus={false}
                showIndicators={true}
                showThumbs={false}
                stopOnHover={true}
              >
                {data?.pictures?.map((slidesData, i) => (
                  <Grid>
                    <Albums slidesData={slidesData} />
                  </Grid>
                ))}
              </Carousel>
            )}

            {isMobile && (
              <Grid className='mob-carousel'>
                <Carousel
                  autoPlay={!true}
                  centerMode={true}
                  centerSlidePercentage={100}
                  emulateTouch={true}
                  infiniteLoop={true}
                  interval={1500}
                  showArrows={true}
                  showStatus={false}
                  showIndicators={true}
                  showThumbs={false}
                  stopOnHover={true}
                >
                  {data.pictures &&
                    Object.values(data.pictures[0])
                      .slice(0, 4)
                      .map((value, i) => {
                        return (
                          <Box key={value + i}>
                            <img className='mob-carousel-img' src={value} />
                          </Box>
                        );
                      })}
                </Carousel>
              </Grid>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Gallery;
