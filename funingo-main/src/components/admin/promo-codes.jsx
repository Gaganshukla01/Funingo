// import React, { useEffect, useState } from 'react';
// import { addCoupon, deleteCoupon, getAllCoupons } from '../../actions/admin';
// import { useSelector } from 'react-redux';
// import {
//   Box,
//   Grid,
//   IconButton,
//   TextField,
//   Typography,
//   styled,
//   Button,
//   FormHelperText,
//   Backdrop,
//   CircularProgress,
//   Checkbox
// } from '@mui/material';
// import { DeleteForever } from '@mui/icons-material';
// import { useForm } from 'react-hook-form';
// import Select from 'react-select';

// const Label = styled(Typography)({
//   marginBottom: '5px',
//   fontWeight: '600'
// });

// const NumberTextField = styled(TextField)({
//   '& input': {
//     height: '40px',
//     padding: '0px 10px !important'
//   }
// });

// const PromoCodes = () => {
//   const { token } = useSelector(state => state.userSlice);
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch
//   } = useForm({
//     defaultValues: {
//       code: '',
//       discount_type: 'flat',
//       discount: '',
//       max_discount: '',
//       min_amount: '',
//       is_premium: false
//     }
//   });

//   const discountType = watch('discount_type');
//   const isPremium = watch('is_premium');

//   const fetchCoupons = async () => {
//     const resp = await getAllCoupons({ token });
//     setCoupons(resp?.coupons || []);
//   };

//   const deleteOneCoupon = async id => {
//     setLoading(true);
//     await deleteCoupon({ token, id });
//     await fetchCoupons();
//     setLoading(false);
//   };

//   const addOneCoupon = async data => {
//     setLoading(true);
//     await addCoupon({ token, data });
//     await fetchCoupons();
//     reset();
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   return (
//     <Grid
//       sx={{
//         display: 'flex',
//         position: 'relative'
//       }}
//     >
//       <Backdrop
//         open={loading}
//         sx={{
//           zIndex: 1010
//         }}
//       >
//         <CircularProgress />
//       </Backdrop>
//       <Grid
//         flexBasis={'50%'}
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           flexDirection: 'column'
//         }}
//       >
//         <Typography variant='h5' mb='15px'>
//           All Promo Codes
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             gap: '10px',
//             flexDirection: 'column'
//           }}
//         >
//           {coupons.map(coupon => (
//             <Grid
//               sx={{
//                 border: '1px solid #7c7c7c',
//                 width: '400px',
//                 padding: '10px',
//                 position: 'relative',
//                 borderRadius: '5px'
//               }}
//             >
//               <IconButton
//                 onClick={() => deleteOneCoupon(coupon._id)}
//                 sx={{
//                   position: 'absolute',
//                   right: '0px',
//                   top: '0px',
//                   color: 'red'
//                 }}
//               >
//                 <DeleteForever />
//               </IconButton>
//               <Typography>
//                 Code -{' '}
//                 <Typography
//                   component={'span'}
//                   sx={{
//                     textTransform: 'none',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {coupon.code}
//                   &nbsp;
//                   <Typography component={'span'}>
//                     {coupon.is_premium ? '(Premium)' : ''}
//                   </Typography>
//                 </Typography>
//               </Typography>
//               <Typography>
//                 Discount Type -{' '}
//                 <Typography
//                   component={'span'}
//                   sx={{
//                     textTransform: 'capitalize',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {coupon.discount_type}
//                 </Typography>
//               </Typography>
//               <Typography>
//                 Discount -{' '}
//                 <Typography
//                   component={'span'}
//                   sx={{
//                     textTransform: 'capitalize',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {`${coupon.discount_type === 'flat' ? 'Rs.' : ''} ${
//                     coupon.discount
//                   }${coupon.discount_type === 'flat' ? '' : '%'} `}
//                 </Typography>
//               </Typography>
//               {coupon?.discount_type === 'percent' && (
//                 <Typography>
//                   Maximum discount -{' '}
//                   <Typography
//                     component={'span'}
//                     sx={{
//                       textTransform: 'capitalize',
//                       fontWeight: '600'
//                     }}
//                   >
//                     {coupon.max_discount}
//                   </Typography>
//                 </Typography>
//               )}
//               <Typography>
//                 Minimum amount -{' '}
//                 <Typography
//                   component={'span'}
//                   sx={{
//                     textTransform: 'capitalize',
//                     fontWeight: '600'
//                   }}
//                 >
//                   {coupon.min_amount}
//                 </Typography>
//               </Typography>
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//       <Grid
//         flexBasis={'50%'}
//         sx={{
//           borderLeft: '1px solid #7c7c7c1b',
//           p: '0px 20px',
//           display: 'flex',
//           alignItems: 'center',
//           flexDirection: 'column',
//           width: '400px'
//         }}
//       >
//         <Typography variant='h5' mb='15px'>
//           Add new Promo Code
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '15px',
//             width: '300px'
//           }}
//         >
//           <Box>
//             <Label>Code</Label>
//             <TextField
//               fullWidth
//               placeholder='Enter the code'
//               {...register('code', { required: 'Code is required!' })}
//             />
//             {errors?.code && (
//               <FormHelperText error>{errors?.code?.message}</FormHelperText>
//             )}
//           </Box>
//           <Box>
//             <Label>Discount type</Label>
//             <Select
//               options={['flat', 'percent'].map(opt => ({
//                 label: opt[0].toUpperCase() + opt.slice(1),
//                 value: opt
//               }))}
//               onChange={val => setValue('discount_type', val.value)}
//               value={{
//                 label: discountType[0].toUpperCase() + discountType.slice(1),
//                 value: discountType
//               }}
//             />
//           </Box>
//           <Box>
//             <Label>
//               Discount (in {`${discountType === 'flat' ? 'Rupees' : 'Percent'}`}
//               )
//             </Label>
//             <NumberTextField
//               type='number'
//               fullWidth
//               placeholder='Enter the price of the package'
//               {...register('discount', {
//                 required: 'Discount is required!',
//                 min: {
//                   value: 1,
//                   message: 'Discount must be greater than 0'
//                 }
//               })}
//             />
//             {errors?.discount && (
//               <FormHelperText error>{errors?.discount?.message}</FormHelperText>
//             )}
//           </Box>
//           {discountType === 'percent' && (
//             <Box>
//               <Label>Maximum Discount (in Rupees)</Label>
//               <NumberTextField
//                 type='number'
//                 fullWidth
//                 placeholder='Enter the price of the package'
//                 {...register('max_discount', {
//                   required: 'Maximum discount is required!',
//                   min: {
//                     value: 1,
//                     message: 'Maximum discount must be greater than 0'
//                   }
//                 })}
//               />
//               {errors?.max_discount && (
//                 <FormHelperText error>
//                   {errors?.max_discount?.message}
//                 </FormHelperText>
//               )}
//             </Box>
//           )}
//           <Box>
//             <Label>Minimum amount (in Rupees)</Label>
//             <NumberTextField
//               type='number'
//               fullWidth
//               placeholder='Enter the price of the package'
//               {...register('min_amount', {
//                 required: 'Minimum amount is required!',
//                 min: {
//                   value: 1,
//                   message: 'Minimum amount must be greater than 0'
//                 }
//               })}
//             />
//             {errors?.min_amount && (
//               <FormHelperText error>
//                 {errors?.min_amount?.message}
//               </FormHelperText>
//             )}
//           </Box>
//           {/* <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}
//           >
//             <Box
//               component='label'
//               htmlFor='is_premium'
//               sx={{
//                 marginBottom: '5px',
//                 fontWeight: '600'
//               }}
//             >
//               Premium plan
//             </Box>
//             <Checkbox
//               id='is_premium'
//               {...register('is_premium', { required: true })}
//               onChange={e => setValue('is_premium', e.target.checked)}
//               checked={isPremium}
//             />
//           </Box> */}
//           <Button
//             variant='contained'
//             sx={{
//               padding: '5px'
//             }}
//             onClick={handleSubmit(addOneCoupon)}
//           >
//             Add Package
//           </Button>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default PromoCodes;












import React, { useEffect, useState } from 'react';
import { addCoupon, deleteCoupon, getAllCoupons,updateCouponCount } from '../../actions/admin';
import { useSelector } from 'react-redux';
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
  CircularProgress,
  Checkbox
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import "./promo-codes.css"

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

const PromoCodes = () => {
  const { token } = useSelector(state => state.userSlice);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      
      code:'',
      count:'',
      discount_type: 'flat',
      discount: '',
      max_discount: '',
      min_amount: '',
      is_premium: false
    }
  });

  const discountType = watch('discount_type');
  const isPremium = watch('is_premium');

  const fetchCoupons = async () => {
    const resp = await getAllCoupons({ token });
    setCoupons(resp?.coupons || []);
  };
  
  const deleteOneCoupon = async id => {
    setLoading(true);
    await deleteCoupon({ token, id });
    // await updateCouponCount({ token, id });
    await fetchCoupons();
    setLoading(false);
  };

  const addOneCoupon = async data => {
    console.log(data)
    setLoading(true);
    await addCoupon({ token, data });
    await fetchCoupons();
    reset();
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
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
          {coupons.map(coupon => (
            <Grid
              sx={{
                border: '1px solid #7c7c7c',
                width: '400px',
                padding: '10px',
                position: 'relative',
                borderRadius: '5px'
              }}
            >
              <IconButton
                onClick={() => deleteOneCoupon(coupon._id)}
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
                Code -{' '}
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: '600'
                  }}
                >
                  {coupon.code}
                  &nbsp;
                  <Typography component={'span'}>
                    {coupon.is_premium ? '(Premium)' : ''}
                  </Typography>
                </Typography>
              </Typography>
              <Typography>
                Discount Type -{' '}
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: '600'
                  }}
                >
                  {coupon.discount_type}
                </Typography>
              </Typography>


              <Typography>
                Discount -{' '}
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: '600'
                  }}
                >
                  {`${coupon.discount_type === 'flat' ? 'Rs.' : ''} ${
                    coupon.discount
                  }${coupon.discount_type === 'flat' ? '' : '%'} `}
                </Typography>
              </Typography>




              <Typography>
                Count -{' '}
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: '600'
                  }}
                >
                  {
                    `${coupon.count}`
                  }
                </Typography>
              </Typography>


              {coupon?.discount_type === 'percent' && (
                <Typography>
                  Maximum discount -{' '}
                  <Typography
                    component={'span'}
                    sx={{
                      textTransform: 'capitalize',
                      fontWeight: '600'
                    }}
                  >
                    {coupon.max_discount}
                  </Typography>
                </Typography>
              )}
              <Typography>
                Minimum amount -{' '}
                <Typography
                  component={'span'}
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: '600'
                  }}
                >
                  {coupon.min_amount}
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
          Add new Promo Code
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
            <Label>Code</Label>
            <TextField
              fullWidth
              placeholder='Enter the code'
              {...register('code', { required: 'Code is required!' })}
            />
            {errors?.code && (
              <FormHelperText error>{errors?.code?.message}</FormHelperText>
            )}
          </Box>

          
          <Box>
            <Label>
              Count
            </Label>
            <NumberTextField
              type='number'
              fullWidth
              placeholder='Enter the count of the code'
              {...register('count', {
                required: 'count is required!',
                min: {
                  value: 1,
                  message: 'count must be greater than 0'
                }
              })}
            />
            {errors?.count && (
              <FormHelperText error>{errors?.count?.message}</FormHelperText>
            )}
          </Box>
            
            
          {/* <Box>
            <Label>Minimum amount (in Rupees)</Label>
            <NumberTextField
              type='number'
              fullWidth
              placeholder='Enter the price of the package'
              {...register('min_amount', {
                required: 'Minimum amount is required!',
                min: {
                  value: 1,
                  message: 'Minimum amount must be greater than 0'
                }
              })}
            />
            {errors?.min_amount && (
              <FormHelperText error>
                {errors?.min_amount?.message}
              </FormHelperText>
            )}
          </Box> */}



          <Box>
            <Label>Discount type</Label>
            <Select
              options={['flat', 'percent'].map(opt => ({
                label: opt[0].toUpperCase() + opt.slice(1),
                value: opt
              }))}
              onChange={val => setValue('discount_type', val.value)}
              value={{
                label: discountType[0].toUpperCase() + discountType.slice(1),
                value: discountType
              }}
            />
          </Box>
          <Box>
            <Label>
              Discount (in {`${discountType === 'flat' ? 'Rupees' : 'Percent'}`}
              )
            </Label>
            <NumberTextField
              type='number'
              fullWidth
              placeholder='Enter the price of the package'
              {...register('discount', {
                required: 'Discount is required!',
                min: {
                  value: 1,
                  message: 'Discount must be greater than 0'
                }
              })}
            />
            {errors?.discount && (
              <FormHelperText error>{errors?.discount?.message}</FormHelperText>
            )}
          </Box>
          {discountType === 'percent' && (
            <Box>
              <Label>Maximum Discount (in Rupees)</Label>
              <NumberTextField
                type='number'
                fullWidth
                placeholder='Enter the price of the package'
                {...register('max_discount', {
                  required: 'Maximum discount is required!',
                  min: {
                    value: 1,
                    message: 'Maximum discount must be greater than 0'
                  }
                })}
              />
              {errors?.max_discount && (
                <FormHelperText error>
                  {errors?.max_discount?.message}
                </FormHelperText>
              )}
            </Box>
          )}
          <Box>
            <Label>Minimum amount (in Rupees)</Label>
            <NumberTextField
              type='number'
              fullWidth
              placeholder='Enter the price of the package'
              {...register('min_amount', {
                required: 'Minimum amount is required!',
                min: {
                  value: 1,
                  message: 'Minimum amount must be greater than 0'
                }
              })}
            />
            {errors?.min_amount && (
              <FormHelperText error>
                {errors?.min_amount?.message}
              </FormHelperText>
            )}
          </Box>
          {/* <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box
              component='label'
              htmlFor='is_premium'
              sx={{
                marginBottom: '5px',
                fontWeight: '600'
              }}
            >
              Premium plan
            </Box>
            <Checkbox
              id='is_premium'
              {...register('is_premium', { required: true })}
              onChange={e => setValue('is_premium', e.target.checked)}
              checked={isPremium}
            />
          </Box> */}
          <Button
            variant='contained'
            sx={{
              padding: '5px'
            }}
            onClick={handleSubmit(addOneCoupon)}
          >
            Add Package
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PromoCodes;
