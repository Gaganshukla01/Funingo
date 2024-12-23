import React, { useEffect } from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteForever } from '@mui/icons-material';

import { deleteApplication, fetchApplication } from '../../actions/career';

const CareerAppications = () => {
  const dispatch = useDispatch();
  const { careerApplications: applications } = useSelector(
    state => state.adminSlice
  );

  const deleteOneApplication = id => {
    dispatch(deleteApplication({ id }));
  };

  useEffect(() => {
    dispatch(fetchApplication());
  }, []);

  return (
    <Grid>
      {applications.map(applicant => (
        <Grid
          sx={{
            border: '1px solid #7c7c7c5a',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '10px',
            width: '500px',
            margin: '0px auto 20px',
            padding: '10px',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={() => deleteOneApplication(applicant._id)}
            sx={{
              position: 'absolute',
              right: '0px',
              top: '0px',
              color: 'red'
            }}
          >
            <DeleteForever />
          </IconButton>
          <Box display={'flex'}>
            <Typography>Name:</Typography>&nbsp;
            <Typography>{applicant.name}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Email:</Typography>&nbsp;
            <Typography>{applicant.email}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Mobile number:</Typography>&nbsp;
            <Typography>{applicant.phone_no}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Location:</Typography>&nbsp;
            <Typography>{applicant.location}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Highest qualification:</Typography>&nbsp;
            <Typography>{applicant.highest_qualification}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Resume / CV url:</Typography>&nbsp;
            <Typography
              component={'a'}
              href={applicant.resume_url}
              target='_blank'
            >
              Click here
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default CareerAppications;
