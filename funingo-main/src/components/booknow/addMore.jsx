import { Button, Dialog, Grid, Typography } from '@mui/material';
import React from 'react';

const AddMoreModal = ({ open, onClose, onContinue, amount }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <Grid p='20px'>
        <Typography fontSize={'18px'} mb={'15px'}>
          Add extra flags worth Rs. {amount} to get funingo money after
          successful payment!!
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            justifyContent: 'flex-end'
          }}
        >
          <Button variant='outlined' onClick={onClose}>
            Add More
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              onClose();
              onContinue();
            }}
          >
            Skip & Continue
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AddMoreModal;
