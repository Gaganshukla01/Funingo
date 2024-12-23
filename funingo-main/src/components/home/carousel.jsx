import React from 'react';
import { Grid, Typography, Button, useMediaQuery } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Img1 from './images/img1.png';
import Img2 from './images/img2.png';
import Img3 from './images/img3.png';
import Img4 from './images/img4.png';
import Img5 from './images/img5.png';
import { Box } from '@mui/material';
import './carousel.scss';

const galleryData = {
  title: 'GALLERY',
  pictures: [
    {
      p1: Img1,
      p2: Img2,
      p3: Img3,
      p4: Img4,
      p5: Img5
    },
    {
      p1: Img1,
      p2: Img2,
      p3: Img3,
      p4: Img4,
      p5: Img5
    },
    {
      p1: Img1,
      p2: Img2,
      p3: Img3,
      p4: Img4,
      p5: Img5
    }
  ]
};
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
  const isMobile = useMediaQuery('(max-width:900px)');

  return (
    <Grid className='home-gallery'>
      {/* {galleryData.map((data, idx) => ( */}
      <Grid className='top2' mb={'8vh'}>
        <Grid className='carousel-box'>
          <Box mb='20px'>
            <Typography className='heading'>
              Gallery
            </Typography>
            <Typography className='subheading'>Sport Events</Typography>
          </Box>
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
              {galleryData?.pictures?.map((slidesData, i) => (
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
                {galleryData.pictures &&
                  Object.values(galleryData.pictures[0])
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
      {/* ))} */}
    </Grid>
  );
};

export default Gallery;
