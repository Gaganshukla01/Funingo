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
import { DeleteForever } from '@mui/icons-material';
import axios from 'axios';
import { apiUrl } from '../../constants';

const CheckConsent = () => {
  const { token } = useSelector(state => state.userSlice);
  const [id, setId] = useState('');

  const fetchConsent = async () => {
    const resp = await axios.get(`${apiUrl}/admin/check-consent/${id}`, {
      headers: { token }
    });
    if (resp.data.ticket?.riskConsentImage?.url)
      window.open(resp.data.ticket?.riskConsentImage?.url);
    else alert("Consent form for this ticket doesn't exist");
  };

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
        <Typography>Ticket Id</Typography>
        <TextField
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder='Ticket ID'
        />
      </Box>
      <Button
        variant='contained'
        sx={{
          mt: '20px'
        }}
        onClick={fetchConsent}
      >
        Fetch Consent
      </Button>
    </Grid>
  );
};

export default CheckConsent;
