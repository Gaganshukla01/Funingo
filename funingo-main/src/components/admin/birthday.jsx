import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usersWithUpcomingBday } from '../../actions/admin';
import { downloadInExcel } from '../../utils';
import { clearUpcomingBdays } from '../../utils/store/slice/adminSlice';

const Birthday = () => {
  const { upcomingBdays } = useSelector(state => state.adminSlice);
  const dispatch = useDispatch();
  const [days_left, setDaysLeft] = useState(null);

  const getData = () => {
    dispatch(usersWithUpcomingBday({ days_left }));
  };

  const downloadData = async () => {
    const data = upcomingBdays;
    downloadInExcel({
      data,
      fileName: `bday-after-${days_left}-days`
    });
    setDaysLeft(null);
  };

  useEffect(() => {
    if (upcomingBdays?.length) {
      downloadData();
    } else {
      if (days_left !== null) {
        alert(`There are no birthdays after ${days_left} days.`);
        setDaysLeft(null);
      }
    }
  }, [upcomingBdays]);

  useEffect(() => {
    if (days_left === null) dispatch(clearUpcomingBdays());
  }, [days_left]);

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box>
        <Typography>Days left for Birthday</Typography>
        <TextField
          value={days_left || ''}
          type='number'
          onChange={e => setDaysLeft(e.target.value)}
          placeholder='Ex: 7'
        />
      </Box>
      <Button
        variant='contained'
        sx={{
          mt: '20px'
        }}
        onClick={getData}
      >
        Download Excel
      </Button>
    </Grid>
  );
};

export default Birthday;
