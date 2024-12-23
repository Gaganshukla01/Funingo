import { Typography, styled } from '@mui/material';

export const Label = styled(Typography)({
  fontSize: '12px',
  lineHeight: '10px'
});

export const Value = styled(Typography)({
  fontWeight: '600',
  fontSize: '16px'
});

export const Heading = styled(Typography)(({ active }) => ({
  fontWeight: active ? '600' : '500',
  fontSize: '20px',
  marginBottom: '20px',
  borderBottom: active ? '1px solid #7c7c7c7b' : 'none',
  cursor: 'pointer',
  padding: '0px 5px'
}));
