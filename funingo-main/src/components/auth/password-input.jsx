import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PasswordInput = props => {
  const [show, setShow] = useState(false);
  return (
    <>
      <input {...props} type={show ? 'text' : 'password'} />
      <IconButton
        sx={{
          position: 'absolute',
          right: '10px',
          zIndex: 11
        }}
        onClick={() => setShow(curr => !curr)}
      >
        {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </>
  );
};

export default PasswordInput;
