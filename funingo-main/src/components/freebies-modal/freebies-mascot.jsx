import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import FreebiesGif from '../../assets/freebies-mascot.png';
import staticMascot from '../../assets/freebies-mascot.png';
import { useSelector } from 'react-redux';

const FreebiesMascot = ({ small = false, backgroundFilter = true }) => {
  const { freebiesArray: freebies = [], userData: {funingo_money: userfunmoneyfromnavbar} } = useSelector(
    state => state.userSlice
  );
  const [gif, setGif] = useState(FreebiesGif);

  

  const reloadGif = () => {
    setGif(staticMascot);
    setTimeout(() => {
      setGif(FreebiesGif);
    }, 0);
  };

  useEffect(() => {
    const intervlaId = setInterval(() => {
      reloadGif();
    }, 2000);

    return () => {
      clearInterval(intervlaId);
    };
  }, []);

  const flags = useMemo(() => {
    return freebies.reduce(
      (prevFlags, existingFlags) => ({
        red: prevFlags.red + existingFlags.red,
        green: prevFlags.green + existingFlags.green,
        yellow: prevFlags.yellow + existingFlags.yellow,
        golden: prevFlags.golden + existingFlags.golden
      }),
      {
        red: 0,
        green: 0,
        yellow: 0,
        golden: 0
      }
    );
  }, [freebies]);

  // console.log("flags",flags);

  return (
    <Grid
      sx={{
        background: 'transparent',
        position: 'relative',
        width: { xs: '365px', sm: small ? 'none' : '400px' }
      }}
    >
      <Box
        component='img'
        src={gif}
        width={{ xs: '365px', sm: small ? 'none' : '400px' }}
        height={{ xs: '475px', sm: small ? 'none' : '550px' }}
        sx={{
          filter: backgroundFilter ? 'drop-shadow(0 0 10px #fff)' : 'none'
        }}
      />
      <Box>
        {/* <Typography
          sx={{
            position: 'absolute',
            top: { xs: '150px', sm: small ? 'none' : '177px' },
            right: { xs: '95px', sm: small ? 'none' : '103px' },
            fontWeight: '600',
            fontSize: '16px',
            transform: 'rotate(-22deg)'
          }}
        >
          {flags.green}
        </Typography> */}
        {/* <Typography
          sx={{
            position: 'absolute',
            top: { xs: '141px', sm: small ? 'none' : '165px' },
            right: { xs: '71px', sm: small ? 'none' : '78px' },
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          {flags.red}
        </Typography> */}
        {userfunmoneyfromnavbar === 0 ? (
  <Typography
    sx={{
      position: 'absolute',
      top: { xs: '176px', sm: small ? 'none' : '205px' },
      right: { xs: '87px', sm: small ? 'none' : '96px' },
      fontWeight: '600',
      fontSize: '13px',
      transform: 'rotate(0deg)',
      color: 'white'
    }}
  >
    {userfunmoneyfromnavbar}
  </Typography>
) : userfunmoneyfromnavbar < 10000 ? userfunmoneyfromnavbar < 1000 ? (
  <Typography
    sx={{
      position: 'absolute',
      top: { xs: '174px', sm: small ? 'none' : '204px' },
      right: { xs: '80px', sm: small ? 'none' : '90px' },
      fontWeight: '600',
      fontSize: '13px',
      transform: 'rotate(0deg)',
      color: 'white'
    }}
  >
    {userfunmoneyfromnavbar}
  </Typography>
) : (
  <Typography
    sx={{
      position: 'absolute',
      top: { xs: '174px', sm: small ? 'none' : '202px' },
      right: { xs: '77px', sm: small ? 'none' : '85px' },
      fontWeight: '600',
      fontSize: '13px',
      transform: 'rotate(0deg)',
      color: 'white'
    }}
  >
    {userfunmoneyfromnavbar}
  </Typography>
) : (
  <Typography
    sx={{
      position: 'absolute',
      top: { xs: '174px', sm: small ? 'none' : '202px' },
      right: { xs: '74px', sm: small ? 'none' : '82px' },
      fontWeight: '600',
      fontSize: '13px',
      transform: 'rotate(0deg)',
      color: 'white'
    }}
  >
    {userfunmoneyfromnavbar}
  </Typography>
)}


        {/* <Typography
          sx={{
            position: 'absolute',
            top: { xs: '168px', sm: small ? 'none' : '196px' },
            right: { xs: '68px', sm: small ? 'none' : '73px' },
            fontWeight: '600',
            fontSize: '16px',
            transform: 'rotate(43deg)'
          }}
        >
          {flags.golden}
        </Typography> */}
      </Box>
    </Grid>
  );
};

export default FreebiesMascot;
