import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, useFormik } from 'formik';
import {
  Grid,
  useMediaQuery,
  Select as MUISelect,
  Typography
} from '@mui/material';
import Packagecard from './packagescard';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Tour from '@mui/icons-material/Tour';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import IndividualFlag from './individualFlags';
import InfoIcon from '@mui/icons-material/Info';

const CardEditForm = ({
  initialValues,
  packagesData,
  onSubmit,
  freebiesOption,
  handleEditCancel,
  selectedPremium
}) => {
  const freebiesArray = useSelector(store => store.userSlice.freebiesArray);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [showTrampolinePopup, setShowTrampolinePopup] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      onSubmit: onSubmit
    });

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
  ];

  const packageOptions = packagesData.map(packageObj => ({
    value: packageObj?._id,
    label: <Packagecard data={packageObj} boolFlag={true} />
  }));

  useEffect(() => {
    if (showTrampolinePopup) {
      const timeoutId = setTimeout(() => {
        setShowTrampolinePopup(false);
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [showTrampolinePopup]);

  return (
    <Formik
      width={'100%'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <Grid
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={isMobile ? 'column' : 'row'}
          sx={{
            '& label': {
              mb: '5px'
            }
          }}
        >
          <Grid
            className='input-name'
            display={'flex'}
            flexDirection={'column'}
            width={isMobile ? '100%' : '55%'}
            marginBottom={isMobile ? '4%' : '1%'}
          >
            <label>Name</label>
            <Field
              name='name'
              type='text'
              placeholder='Name'
              value={values.name}
              onChange={handleChange}
              required={true}
            />
          </Grid>
          <Grid
            display={'flex'}
            justifyContent={'space-between'}
            gap={'10%'}
            width={isMobile ? '100%' : '40%'}
            marginBottom={isMobile ? '1%' : '1%'}
          >
            <Grid
              className='input-age'
              display={'flex'}
              flexDirection={'column'}
              flexBasis={'50%'}
            >
              <label>Age</label>
              <Field
                name='age'
                type='text'
                placeholder='Age'
                value={values.age}
                onChange={handleChange}
                required={true}
              />
            </Grid>
            <Grid
              className='input-gender'
              display={'flex'}
              flexDirection={'column'}
              flexBasis={'50%'}
            >
              <label>Gender</label>
              <Select
                value={
                  genderOptions.find(
                    option => option?.value === values?.gender
                  ) ?? null
                }
                onChange={e => {
                  setFieldValue('gender', e?.value);
                  // handleChange();
                }}
                onBlur={handleBlur}
                placeholder='Select'
                styles={{
                  control: provided => ({
                    ...provided,
                    background: 'white',
                    height: '40px'
                  }),
                  input: provided => ({
                    ...provided,
                    color: 'black',
                    '& input': {
                      height: '30px'
                    }
                  }),
                  ValueContainer: provided => ({
                    ...provided
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isSelected ? 'white' : 'black'
                  })
                }}
                required={true}
                isSearchable={false}
                options={genderOptions}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          display={'flex'}
          flexDirection='column'
          justifyContent={'space-between'}
          mt='10px'
          mb={'4%'}
          width={'100%'}
          // flexDirection={isMobile ? 'column' : 'row'}
          // gap={"10px"}
        >
          <Grid
            display={'flex'}
            width={'100%'}
            flexDirection={'column'}
            marginBottom={isMobile ? '4%' : '1%'}
          >
            <label>Select Packages</label>
            <Select
              id='package'
              name='package'
              isDisabled={selectedPremium?.premium_type === '100%'}
              value={
                packageOptions.find(
                  option => option.value === values.package
                ) ?? null
              }
              onChange={e => {
                setFieldValue('package', e?.value || null);
                // handleChange(e.value);
              }}
              onBlur={handleBlur}
              placeholder='Select a package...'
              styles={{
                control: provided => ({
                  ...provided,
                  background: 'white'
                }),
                input: provided => ({
                  ...provided,
                  color: 'black',
                  '& input': {
                    height: '30px'
                  }
                }),
                option: (provided, { isSelected }) => ({
                  ...provided,
                  background: isSelected ? 'beige' : 'white',

                  '&:hover': {
                    background: '#f5f5dc63'
                  }
                })
              }}
              required={values.golden_flag === 0}
              isClearable
              isSearchable={false}
              options={packageOptions}
            />
          </Grid>

          <Grid display={'flex'} justifyContent={'space-between'} mb={'15px'}>
            <Grid className='input-freebies'>
              <Grid mb='15px' title='One Trampoline flag is for 30 minutes'>
                <Typography className='book-now-label' fontSize={'16px'}>
                  For Trampoline Park{' '}
                  <Typography
                    component={'span'}
                    fontSize={'12px'}
                    position={'relative'}
                  >
                    (Can be selected without other packages)&nbsp;
                    <InfoIcon
                      sx={{
                        width: '15px',
                        height: '15px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowTrampolinePopup(true)}
                    />
                    {showTrampolinePopup && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          right: '-150px',
                          top: '-22px',
                          background: 'white',
                          color: 'black',
                          padding: '0px 5px',
                          borderRadius: '5px'
                        }}
                      >
                        One Trampoline flag is for 30 minutes
                      </Typography>
                    )}
                  </Typography>
                </Typography>
                <IndividualFlag
                  label={
                    <Tour
                      sx={{
                        color: '#FFD700'
                      }}
                    />
                  }
                  mode='dark'
                  isDisabled={selectedPremium?.premium_type === '100%'}
                  value={values.golden_flag}
                  onChange={val => setFieldValue('golden_flag', val)}
                />
              </Grid>
              <label className='book-now-label'>Add Individual Flags</label>
              <Grid
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <IndividualFlag
                  label={
                    <Tour
                      sx={{
                        color: '#fa1942'
                      }}
                    />
                  }
                  mode='dark'
                  isDisabled={selectedPremium?.premium_type === '100%'}
                  value={values.extra_red}
                  onChange={val => setFieldValue('extra_red', val)}
                />
                <IndividualFlag
                  label={
                    <Tour
                      sx={{
                        color: '#e7e710'
                      }}
                    />
                  }
                  mode='dark'
                  isDisabled={selectedPremium?.premium_type === '100%'}
                  value={values.extra_yellow}
                  onChange={val => setFieldValue('extra_yellow', val)}
                />
                <IndividualFlag
                  label={
                    <Tour
                      sx={{
                        color: '#76de9a'
                      }}
                    />
                  }
                  mode='dark'
                  isDisabled={selectedPremium?.premium_type === '100%'}
                  value={values.extra_green}
                  onChange={val => setFieldValue('extra_green', val)}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            display={'flex'}
            width={'100%'}
            flexDirection={'column'}
            marginBottom={isMobile ? '4%' : '1%'}
          >
            <label>FreeBies</label>
            <Select
              id='freebies'
              name='freebies'
              isDisabled={selectedPremium?.premium_type === '100%'}
              value={
                freebiesArray?.find(
                  option => option?.id === values?.freebies
                ) ?? null
              }
              onChange={e => {
                setFieldValue('freebies', e?.value);
                // handleChange(e?.value);
              }}
              onBlur={handleBlur}
              placeholder='Have any freebies?'
              styles={{
                control: provided => ({
                  ...provided,
                  background: 'white'
                }),
                input: provided => ({
                  ...provided,
                  color: 'black',
                  '& input': {
                    height: '30px'
                  }
                }),
                ValueContainer: provided => ({
                  ...provided
                })
              }}
              noOptionsMessage={() => "You don't have any freebies"}
              isSearchable={false}
              options={freebiesOption}
            />
          </Grid>
        </Grid>

        <Grid
          display={'flex'}
          mt='2%'
          width={'fit-content'}
          gap='20px'
          justifyContent={'space-between'}
          alignItems={'center'}
          height={'40px'}
          flexDirection={'row'}
          sx={{
            float: 'right',
            mb: '15px'
          }}
        >
          <Button
            variant='outlined'
            sx={{
              boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
              borderRadius: '5px',
              padding: '5px 20px'
            }}
            onClick={handleEditCancel}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{
              boxShadow: '0px 2.5 9 0px rgba(0, 0, 0, 0.25)',
              borderRadius: '5px',
              padding: '5px 25px'
            }}
          >
            Save
          </Button>
        </Grid>
      </Form>
    </Formik>
  );
};

export default CardEditForm;
