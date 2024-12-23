import React, { useState } from 'react';
import { Box, Grid, Typography, styled } from '@mui/material';
import Packages from './packages';
import PromoCodes from './promo-codes';
import Images from './images';
import ContactNumber from './contact-no';
import Franchise from './franchise';
import CareerAppications from './career-appications';
import CheckConsent from './check-consent';
import Birthday from './birthday';

const NavBtn = styled(Typography)(({ active }) => ({
  padding: '5px 15px',
  cursor: 'pointer',
  borderBottom: active ? '1px solid #7c7c7c' : '1px solid #7c7c7c2b',
  fontWeight: active ? '600' : '500',
  fontSize: '16px'
}));

const AdminPortal = () => {
  const [active, setActive] = useState(0);
  const getActivePage = () => {
    switch (active) {
      case 0:
        return <Packages />;
      case 1:
        return <PromoCodes />;
      case 2:
        return <Images />;
      case 3:
        return <ContactNumber />;
      case 4:
        return <Franchise />;
      case 5:
        return <CareerAppications />;
      case 6:
        return <CheckConsent />;
      case 7:
        return <Birthday />;
      default:
        return <Packages />;
    }
  };
  return (
    <Grid>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          margin: '0px 20px',
          justifyContent: 'center'
        }}
      >
        <NavBtn active={active === 0} onClick={() => setActive(0)}>
          Packages
        </NavBtn>
        <NavBtn active={active === 1} onClick={() => setActive(1)}>
          Promo Codes
        </NavBtn>
        <NavBtn active={active === 2} onClick={() => setActive(2)}>
          Images
        </NavBtn>
        <NavBtn active={active === 3} onClick={() => setActive(3)}>
          Contact Numbers
        </NavBtn>
        <NavBtn active={active === 4} onClick={() => setActive(4)}>
          Franchises
        </NavBtn>
        <NavBtn active={active === 5} onClick={() => setActive(5)}>
          Career Applications
        </NavBtn>
        <NavBtn active={active === 6} onClick={() => setActive(6)}>
          Check Consent
        </NavBtn>
        <NavBtn active={active === 7} onClick={() => setActive(7)}>
          Birthday
        </NavBtn>
      </Grid>
      <Grid
        sx={{
          padding: '20px'
        }}
      >
        {getActivePage()}
      </Grid>
    </Grid>
  );
};

export default AdminPortal;
