import React from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import Logo from '../../assets/logo.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import m1 from '../../assets/profile-pics/m1.png';
import m2 from '../../assets/profile-pics/m2.png';
import m3 from '../../assets/profile-pics/m3.png';
import m4 from '../../assets/profile-pics/m4.png';
import f1 from '../../assets/profile-pics/f1.png';
import f2 from '../../assets/profile-pics/f2.png';
import f3 from '../../assets/profile-pics/f3.png';
import f4 from '../../assets/profile-pics/f4.png';

import './style.scss';

const ChooseProfile = ({ selectedPicture, handleSelect }) => {
  return (
    <div className='right-side'>
      <div className='main active'>
        <div className='moblogo'>
          {' '}
          <img src={Logo} alt={'logo'}></img>
        </div>
        <div className='text'>
          <h2>Profile Picture</h2>
          <p>Please choose your profile picture</p>
        </div>

        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            mt: '20px'
          }}
        >
          <Grid>
            {/* <Typography
              sx={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#004289',
                textAlign: 'center'
              }}
              mb='10px'
            >
              Men
            </Typography> */}
            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '15px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('m1')}
              >
                <Box>
                  {selectedPicture === 'm1' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={m1} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('m2')}
              >
                <Box>
                  {selectedPicture === 'm2' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={m2} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('m3')}
              >
                <Box>
                  {selectedPicture === 'm3' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={m3} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('m4')}
              >
                <Box>
                  {selectedPicture === 'm4' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={m4} className='profile-pic' />
              </Box>
            </Grid>
          </Grid>
          <Grid>
            {/* <Typography
              sx={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#004289',
                textAlign: 'center'
              }}
              mb='10px'
            >
              Women
            </Typography> */}
            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '15px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('f1')}
              >
                <Box>
                  {selectedPicture === 'f1' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={f1} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('f2')}
              >
                <Box>
                  {selectedPicture === 'f2' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={f2} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('f3')}
              >
                <Box>
                  {selectedPicture === 'f3' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={f3} className='profile-pic' />
              </Box>
              <Box
                className='profile-pic-container'
                onClick={() => handleSelect('f4')}
              >
                <Box>
                  {selectedPicture === 'f4' && (
                    <CheckCircleIcon className='selected-pic' />
                  )}
                </Box>
                <Box component='img' src={f4} className='profile-pic' />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Button
          fullWidth
          variant='contained'
          type='submit'
          sx={{
            mt: '20px'
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChooseProfile;
