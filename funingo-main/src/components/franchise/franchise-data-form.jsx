import React, { useState } from 'react';
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

import './style.scss';
import { useSelector, useDispatch } from 'react-redux';
import { addFranchise } from '../../actions/franchise';
import Snackbarcomponent from '../snackbar/snackbar';

const FranchiseDataForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const defaultSnackbarData = {
    show: false,
    msg: '',
    severity: ''
  };
  const [snackbarData, setSnackbarData] = useState(defaultSnackbarData);

  const onSubmit = async data => {
    setLoading(true);
    const res = await dispatch(addFranchise({ data }));
    console.log(res);
    setLoading(false);
    if (res.type === 'add/franchise/fulfilled') {
      setSnackbarData({
        show: true,
        msg: 'Your request has been submitted',
        severity: 'success'
      });
      reset();
    } else {
      setSnackbarData({
        show: true,
        msg: 'Your request has been failed. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Grid
      className='formfill'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography className='subheading'>
        Request a Call Back by Filling this Form
      </Typography>

      <Snackbarcomponent
        open={snackbarData.show}
        snackDetails={{
          msg: snackbarData.msg,
          severity: snackbarData.severity
        }}
        handlerForSnack={() => setSnackbarData(defaultSnackbarData)}
      />

      <Grid className='franchise-form'>
        <Grid>
          <Box>
            <Typography className='form-label'>Name</Typography>
            <TextField
              {...register('name', 'Please fill your name')}
              className='form-input'
              placeholder='Enter your name'
              error={errors?.name}
              helperText={errors?.name?.message}
            />
          </Box>
          <Box>
            <Typography className='form-label'>Mobile Number</Typography>
            <TextField
              {...register('phone_no', 'Please fill your name')}
              className='form-input'
              placeholder='Enter your phone number'
              error={errors?.phone_no}
              helperText={errors?.phone_no?.message}
            />
          </Box>
          <Box>
            <Typography className='form-label'>Email ID</Typography>
            <TextField
              {...register('email', 'Please fill your name')}
              className='form-input'
              placeholder='Enter your email id'
              error={errors?.email}
              helperText={errors?.email?.message}
            />
          </Box>
          <Box>
            <Typography className='form-label'>Location</Typography>
            <TextField
              {...register('location', 'Please fill your name')}
              className='form-input'
              placeholder='Enter your location'
              error={errors?.location}
              helperText={errors?.location?.message}
            />
          </Box>
        </Grid>
        <Grid>
          <Box>
            <Typography className='form-label'>Total Available Area</Typography>
            <TextField
              {...register('available_area', 'Please fill your name')}
              className='form-input'
              placeholder='Enter the available area'
              error={errors?.available_area}
              helperText={errors?.available_area?.message}
            />
          </Box>
          <Box>
            <Typography className='form-label'>Available Investment</Typography>
            <TextField
              {...register('available_investment', 'Please fill your name')}
              className='form-input'
              placeholder='Enter your available investment'
              error={errors?.available_investment}
              helperText={errors?.available_investment?.message}
            />
          </Box>
          <Box>
            <Typography className='form-label'>Suitable Date & Time</Typography>
            <TextField
              {...register('suitable_timings', 'Please fill your name')}
              className='form-input'
              placeholder='Enter the suitable timings'
              multiline
              rows={5}
              sx={{
                '& .MuiOutlinedInput-root': {
                  padding: '0px'
                }
              }}
              error={errors?.suitable_timings}
              helperText={errors?.suitable_timings?.message}
            />
          </Box>
        </Grid>
      </Grid>
      <Button
        variant='contained'
        sx={{
          background: '#2CC248',
          boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
          borderRadius: '50px',
          padding: '10px 50px',
          fontFamily: 'Luckiest Guy',
          fontSize: '24px',
          marginTop: '20px',

          '&:hover': {
            background: '#1e8e33'
          }
        }}
        disabled={loading}
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </Grid>
  );
};

export default FranchiseDataForm;
