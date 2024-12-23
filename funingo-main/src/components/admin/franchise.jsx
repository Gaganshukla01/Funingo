import { Box, Grid, Typography, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteForever } from '@mui/icons-material';

import { deleteFranchise, getAllFranchises } from '../../actions/franchise';

const Franchise = () => {
  const dispatch = useDispatch();
  const { franchises } = useSelector(state => state.adminSlice);

  const deleteOneFranchise = id => {
    dispatch(deleteFranchise({ id }));
  };

  useEffect(() => {
    dispatch(getAllFranchises());
  }, []);

  return (
    <Grid>
      {franchises.map(franchise => (
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
            onClick={() => deleteOneFranchise(franchise._id)}
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
            <Typography>{franchise.name}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Email:</Typography>&nbsp;
            <Typography>{franchise.email}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Mobile number:</Typography>&nbsp;
            <Typography>{franchise.phone_no}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Location:</Typography>&nbsp;
            <Typography>{franchise.location}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Available area:</Typography>&nbsp;
            <Typography>{franchise.available_area}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Available investment:</Typography>&nbsp;
            <Typography>{franchise.available_investment}</Typography>
          </Box>
          <Box display={'flex'}>
            <Typography>Suitable timings:</Typography>&nbsp;
            <Typography>{franchise.suitable_timings}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Franchise;
