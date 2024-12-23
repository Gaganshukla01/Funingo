import React, { useEffect, useState } from 'react';
import {
  addCoupon,
  addPhoneNumber,
  deleteCoupon,
  deletePhoneNumber,
  getAllCoupons,
  getPhoneNumbers
} from '../../actions/admin';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
  styled,
  Button,
  FormHelperText,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const Label = styled(Typography)({
  marginBottom: '5px',
  fontWeight: '600'
});

const NumberTextField = styled(TextField)({
  '& input': {
    height: '40px',
    padding: '0px 10px !important'
  }
});

const ContactNumbers = () => {
  const { token } = useSelector(state => state.userSlice);
  const dispatch = useDispatch();
  const { phone_numbers } = useSelector(state => state.appSlice);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      number: ''
    }
  });

  const deleteContact = async id => {
    setLoading(true);
    await deletePhoneNumber({ token, id });
    dispatch(getPhoneNumbers());
    setLoading(false);
  };

  const addContact = async data => {
    setLoading(true);
    await addPhoneNumber({ token, data });
    dispatch(getPhoneNumbers());
    reset();
    setLoading(false);
  };

  useEffect(() => {
    dispatch(getPhoneNumbers());
  }, []);

  return (
    <Grid
      sx={{
        display: 'flex',
        position: 'relative'
      }}
    >
      <Backdrop
        open={loading}
        sx={{
          zIndex: 1010
        }}
      >
        <CircularProgress />
      </Backdrop>
      <Grid
        flexBasis={'50%'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant='h5' mb='15px'>
          All Promo Codes
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column'
          }}
        >
          {phone_numbers.map(contact => (
            <Grid
              sx={{
                border: '1px solid #7c7c7c',
                width: '400px',
                padding: '10px',
                position: 'relative',
                borderRadius: '5px'
              }}
              key={contact._id}
            >
              <IconButton
                onClick={() => deleteContact(contact._id)}
                sx={{
                  position: 'absolute',
                  right: '0px',
                  top: '0px',
                  color: 'red'
                }}
              >
                <DeleteForever />
              </IconButton>
              <Typography>
                {contact.name}&nbsp;-&nbsp;
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  {contact.number}
                </Typography>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid
        flexBasis={'50%'}
        sx={{
          borderLeft: '1px solid #7c7c7c1b',
          p: '0px 20px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '400px'
        }}
      >
        <Typography variant='h5' mb='15px'>
          Add new contact number
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '300px'
          }}
        >
          <Box>
            <Label>Name</Label>
            <TextField
              fullWidth
              placeholder='Enter the name'
              {...register('name', { required: 'Name is required!' })}
            />
            {errors?.name && (
              <FormHelperText error>{errors?.name?.message}</FormHelperText>
            )}
          </Box>
          <Box>
            <Label>Contact Number</Label>
            <TextField
              fullWidth
              placeholder='Enter the contact number'
              {...register('number', {
                required: 'Contact number is required!'
              })}
            />
            {errors?.number && (
              <FormHelperText error>{errors?.number?.message}</FormHelperText>
            )}
          </Box>
          <Button
            variant='contained'
            sx={{
              padding: '5px'
            }}
            onClick={handleSubmit(addContact)}
          >
            Add Contact
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactNumbers;
