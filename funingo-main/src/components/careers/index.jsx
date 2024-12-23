import React, { useState } from 'react';
import { useEffect } from 'react';
import { Grid, Typography, Button, TextField, Box } from '@mui/material';

import './styles.scss';
import { useNavigate } from 'react-router';

import { scrollToBottom } from '../../utils';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { sendApplication } from '../../actions/career';

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = data => {
    const formdata = new FormData();
    Object.keys(data).forEach(key => {
      formdata.append(key, data[key]);
    });
    formdata.append('resume', file);
    dispatch(sendApplication({ data: formdata }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  return (
    <Grid className='careers'>
      <Grid height='70vh' className='top'>
        <Typography height='60vh' className='heading'>
          Careers
          <i>
            <Typography
              sx={{
                display: 'block',
                fontSize: '16px'
              }}
            >
              Unleash your career's wild side. Join us for a job that's as
              adventurous as you are!
            </Typography>
          </i>
        </Typography>
      </Grid>
      <Grid p='20px 40px'>
        <Typography
          sx={{
            fontSize: '30px',
            fontWeight: '700',
            textAlign: 'center',
            mb: '20px'
          }}
        >
          Life at Funingo
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            mb: '10px'
          }}
        >
          At FUNINGO, we don't just offer jobs, we invite you to become part of
          a vibrant community that thrives on values, ethics, and, most
          importantly, fun! Imagine a workplace where the pursuit of excitement
          is matched only by a commitment to integrity.
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            mb: '10px'
          }}
        >
          We believe in fostering an environment where every team member can
          grow both professionally and personally, all while relishing the joy
          of their work. Here, adventure isn't just an attraction; it's a way of
          life that compliments our values and infuses every task with
          enthusiasm.
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            mb: '10px'
          }}
        >
          Plus, we pride ourselves on providing a comprehensive benefits
          package, including competitive salaries, health and wellness programs,
          and unique perks that make working here not just a job, but an
          enriching experience. If you're seeking a workplace that not only
          challenges you but also respects your principles and encourages a
          spirited approach to work, then join us on this exhilarating journey
          where every day is an adventure, and every moment is an opportunity to
          make a difference.
        </Typography>
      </Grid>
      <Grid
        padding='10px 40px'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            fontSize: '26px',
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          {"Can't find what you are looking for ?"}
        </Typography>
        <Grid
          width={'300px'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <Box>
            <Typography>Name*</Typography>
            <TextField
              fullWidth
              {...register('name', { required: 'Name is required' })}
              placeholder='John Doe'
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </Box>
          <Box>
            <Typography>Email*</Typography>
            <TextField
              fullWidth
              {...register('email', { required: 'Email is required' })}
              placeholder='john@email.com'
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
          </Box>
          <Box>
            <Typography>Phone Number*</Typography>
            <TextField
              fullWidth
              {...register('phone_no', {
                required: 'Phone Number is required'
              })}
              placeholder='79999XXXXX'
              error={!!errors?.phone_number}
              helperText={errors?.phone_number?.message}
            />
          </Box>
          <Box>
            <Typography>Location*</Typography>
            <TextField
              fullWidth
              {...register('location', { required: 'Location is required' })}
              placeholder='Eg. Jabalpur, Madhya Pradesh'
              error={!!errors?.location}
              helperText={errors?.location?.message}
            />
          </Box>
          <Box>
            <Typography>Highest Qualification*</Typography>
            <TextField
              fullWidth
              {...register('highest_qualification', {
                required: 'Highest Qualification is required'
              })}
              placeholder='Eg. Graduation'
              error={!!errors?.highest_qualification}
              helperText={errors?.highest_qualification?.message}
            />
          </Box>
          <Box>
            <Typography>Resume / CV</Typography>
            <TextField type='file' onChange={handleFileChange} />
          </Box>
          <Button
            variant='contained'
            sx={{
              marginTop: '10px'
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Careers;
