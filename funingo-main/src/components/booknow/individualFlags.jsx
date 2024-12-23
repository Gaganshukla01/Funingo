import React, { useEffect, useState } from 'react';
import { Grid, Button, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

const IndividualFlag = ({
  label,
  onChange,
  value,
  mode = 'light',
  isDisabled = false
}) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        border: mode === 'light' ? '1px solid white' : '1px solid #7c7c7c9a',
        borderRadius: '30px',
        padding: '0px 5px',
        justifyContent: 'space-between',
        flexGrow: 1
      }}
    >
      <IconButton
        onClick={() => onChange(Math.max(0, value - 500))}
        disabled={isDisabled}
      >
        <RemoveCircleOutlineOutlinedIcon
          sx={{
            color: mode === 'light' ? 'white' : '#7c7c7c',
            '&:hover': {
              color: mode === 'light' ? 'white' : 'black'
            }
          }}
        />
      </IconButton>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {value}&nbsp;{label}
      </Typography>
      <IconButton onClick={() => onChange(value + 500)} disabled={isDisabled}>
        <ControlPointOutlinedIcon
          sx={{
            color: mode === 'light' ? 'white' : '#7c7c7c',
            '&:hover': {
              color: mode === 'light' ? 'white' : 'black'
            }
          }}
        />
      </IconButton>
    </Grid>
  );
};

export default IndividualFlag;