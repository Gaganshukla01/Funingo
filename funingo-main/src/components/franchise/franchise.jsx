import React from 'react';
import { useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  useMediaQuery
} from '@mui/material';
import { useForm } from 'react-hook-form';
import './style.scss';
import top from './images/rename.png';
import back from './images/back.png';
import FranchiseDataForm from './franchise-data-form';

const Franchise = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Grid className='franchise'>
      {/* first box */}
      <Grid className='top'>
        <Typography height='60vh' className='heading'>
          Franchise
        </Typography>
      </Grid>
      {/* first box end  */}

      {/* second box */}
      <Grid mt='70px' className='top2'>
        <FranchiseDataForm />
      </Grid>
      {/* second box closed */}
    </Grid>
  );
};

export default Franchise;
