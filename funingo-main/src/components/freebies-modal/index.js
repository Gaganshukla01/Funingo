import React from 'react';
import { Dialog } from '@mui/material';

import FreebiesMascot from './freebies-mascot';

const FreebiesModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      PaperProps={{
        sx: { background: 'transparent', boxShadow: 'none', margin: '10px' }
      }}
    >
      <FreebiesMascot />
    </Dialog>
  );
};

export default FreebiesModal;
