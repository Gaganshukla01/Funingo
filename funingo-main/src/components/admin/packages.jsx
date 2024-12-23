// import React, { useEffect, useState } from 'react';
// import { addPackage, deletePackage, getAllPackages } from '../../actions/admin';
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
// import { Tour, DeleteForever } from '@mui/icons-material';
// import { useForm } from 'react-hook-form';

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

// const Packages = () => {
//   const { token } = useSelector(state => state.userSlice);
//   const [packages, setPackages] = useState([]);
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
//       name: '',
//       red: 0,
//       green: 0,
//       yellow: 0,
//       price: '',
//       is_premium: false
//     }
//   });

//   const isPremium = watch('is_premium');

//   const fetchPackages = async () => {
//     const resp = await getAllPackages({ token });
//     setPackages(resp?.packages ?? []);
//   };

//   const deleteOnePackage = async id => {
//     setLoading(true);
//     await deletePackage({ token, id });
//     await fetchPackages();
//     setLoading(false);
//   };

//   const addOnePackage = async data => {
//     setLoading(true);
//     await addPackage({ token, data });
//     await fetchPackages();
//     reset({
//       is_premium: false,
//       name: '',
//       red: 0,
//       green: 0,
//       yellow: 0,
//       price: ''
//     });
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPackages();
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
//           All Packages
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             gap: '10px',
//             flexDirection: 'column'
//           }}
//         >
//           {packages.map(pack => (
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
//                 onClick={() => deleteOnePackage(pack._id)}
//                 sx={{
//                   position: 'absolute',
//                   right: '0px',
//                   top: '0px',
//                   color: 'red'
//                 }}
//               >
//                 <DeleteForever />
//               </IconButton>
//               <Typography
//                 sx={{
//                   textTransform: 'capitalize',
//                   fontWeight: '600',
//                   mb: '5px'
//                 }}
//               >
//                 {pack.name}&nbsp;
//                 <Typography component={'span'}>
//                   {pack.is_premium ? '(Premium)' : ''}
//                 </Typography>
//               </Typography>
//               <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Grid display={'flex'} gap='10px' alignItems={'center'}>
//                   <Typography>Flags -</Typography>
//                   <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   >
//                     {pack?.red}&nbsp;
//                     <Tour
//                       sx={{
//                         color: '#fa1942'
//                       }}
//                     />
//                   </Typography>

//                   <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   >
//                     {pack?.green}&nbsp;{' '}
//                     <Tour
//                       sx={{
//                         color: '#76de9a'
//                       }}
//                     />
//                   </Typography>
//                   <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   >
//                     {pack?.yellow}&nbsp;{' '}
//                     <Tour
//                       sx={{
//                         color: '#fac219'
//                       }}
//                     />
//                   </Typography>
//                 </Grid>
//                 <Typography fontWeight={'600'}>Rs. {pack.price}</Typography>
//               </Grid>
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
//           Add a new Package
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '15px'
//           }}
//         >
//           <Box>
//             <Label>Name</Label>
//             <TextField
//               fullWidth
//               placeholder='Enter the package name'
//               {...register('name', { required: 'Name is required!' })}
//             />
//             {errors?.name && (
//               <FormHelperText error>{errors?.name?.message}</FormHelperText>
//             )}
//           </Box>
//           <Box>
//             <Label>Flags:</Label>
//             <Grid
//               sx={{
//                 display: 'flex',
//                 gap: '10px'
//               }}
//             >
//               <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center'
//                   }}
//                 >
//                   Red{' '}
//                   <Tour
//                     sx={{
//                       color: '#fa1942'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('red', { required: true })}
//                 />
//               </Box>
//               <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center'
//                   }}
//                 >
//                   Green{' '}
//                   <Tour
//                     sx={{
//                       color: '#76de9a'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   min={0}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('green', { required: true })}
//                 />
//               </Box>
//               <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center'
//                   }}
//                 >
//                   Yellow{' '}
//                   <Tour
//                     sx={{
//                       color: '#fac219'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('yellow', { required: true })}
//                 />
//               </Box>
//             </Grid>
//           </Box>
//           <Box>
//             <Label>Price (in Rupees)</Label>
//             <TextField
//               fullWidth
//               placeholder='Enter the price of the package'
//               {...register('price', {
//                 required: 'Price is required!',
//                 min: {
//                   value: 1,
//                   message: 'Price must be greater than 0'
//                 }
//               })}
//             />
//             {errors?.price && (
//               <FormHelperText error>{errors?.price?.message}</FormHelperText>
//             )}
//           </Box>
//           <Button
//             variant='contained'
//             sx={{
//               padding: '5px'
//             }}
//             onClick={handleSubmit(addOnePackage)}
//           >
//             Add Package
//           </Button>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default Packages;



// import React, { useEffect, useState } from 'react';
// import { addPackage, deletePackage, getAllPackages } from '../../actions/admin';
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
//   Checkbox,
// } from '@mui/material';
// import { Tour, DeleteForever,Copyright, CurrencyRupee } from '@mui/icons-material';
// import { useForm } from 'react-hook-form';

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

// const Packages = () => {
//   const { token } = useSelector(state => state.userSlice);
//   const [packages, setPackages] = useState([]);
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
//       name: '',
//       red: 0,
//       green: 0,
//       yellow: 0,
//       price: '',
//       is_premium: false
//     }
//   });

//   const isPremium = watch('is_premium');

//   const fetchPackages = async () => {
//     const resp = await getAllPackages({ token });
//     setPackages(resp?.packages ?? []);
//   };

//   const deleteOnePackage = async id => {
//     setLoading(true);
//     await deletePackage({ token, id });
//     await fetchPackages();
//     setLoading(false);
//   };

//   const addOnePackage = async data => {
//     setLoading(true);
//     await addPackage({ token, data });
//     await fetchPackages();
//     reset({
//       is_premium: false,
//       name: '',
//       red: 0,
//       green: 0,
//       yellow: 0,
//       price: ''
//     });
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchPackages();
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
//           All Packages
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             gap: '10px',
//             flexDirection: 'column'
//           }}
//         >
//           {packages.map(pack => (
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
//                 onClick={() => deleteOnePackage(pack._id)}
//                 sx={{
//                   position: 'absolute',
//                   right: '0px',
//                   top: '0px',
//                   color: 'red'
//                 }}
//               >
//                 <DeleteForever />
//               </IconButton>
//               <Typography
//                 sx={{
//                   textTransform: 'capitalize',
//                   fontWeight: '600',
//                   mb: '5px'
//                 }}
//               >
//                 {pack.name}&nbsp;
//                 <Typography component={'span'}>
//                   {pack.is_premium ? '(Premium)' : ''}
//                 </Typography>
//               </Typography>
//               <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Grid display={'flex'} gap='10px' alignItems={'center'}>
//                   <Typography>Coins -</Typography>
//                   {/* <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   >
//                     {pack?.red}&nbsp;
//                     <Tour
//                       sx={{
//                         color: '#fa1942'
//                       }}
//                     />
//                   </Typography> */}

//                   {/* <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   > */}
//                     {/* {pack?.green}&nbsp;{' '}
//                     <Tour
//                       sx={{
//                         color: '#76de9a'
//                       }}
//                     /> */}
//                   {/* </Typography> */}
//                   <Typography
//                     fontWeight={'600'}
//                     display={'flex'}
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                   >
//                     {pack?.yellow}&nbsp;{' '}
//                     <Copyright
//                       sx={{
//                         color: '#fac219'
//                       }}
//                     />
//                   </Typography>
//                 </Grid>
//                 <Typography fontWeight={'600'}>Rs. {pack.price}</Typography>
//               </Grid>
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
//           Add a new Package
//         </Typography>
//         <Grid
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '15px'
//           }}
//         >
//           <Box>
//             <Label>Name</Label>
//             <TextField
//               fullWidth
//               placeholder='Enter the package name'
//               {...register('name', { required: 'Name is required!' })}
//             />
//             {errors?.name && (
//               <FormHelperText error>{errors?.name?.message}</FormHelperText>
//             )}
//           </Box>
//           <Box>
//             {/* <Label>Coins:</Label> */}
//             <Grid
//               sx={{
//                 display: 'flex',
//                 gap: '10px'
//               }}
//             >
//               {/* <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center'
//                   }}
//                 >
//                   Red{' '}
//                   <Tour
//                     sx={{
//                       color: '#fa1942'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('red', { required: true })}
//                 />
//               </Box>
//               <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center'
//                   }}
//                 >
//                   Green{' '}
//                   <Tour
//                     sx={{
//                       color: '#76de9a'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   min={0}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('green', { required: true })}
//                 />
//               </Box> */}
//               <Box>
//                 <Typography
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     padding: '0px'
//                   }}
//                 >
//                   <b>Coins</b>
//                   <Copyright
//                     sx={{
//                       color: '#fac219',
//                       paddingLeft:'5px'
//                     }}
//                   />
//                 </Typography>
//                 <NumberTextField
//                   type='number'
//                   inputProps={{
//                     min: 0
//                   }}
//                   sx={{
//                     width: '100px'
//                   }}
//                   defaultValue={0}
//                   {...register('yellow', { required: true })}
//                 />
//               </Box>
//             </Grid>
//           </Box>
//           <Box>
//             <Label>Price (in Rupees)</Label>
//             <TextField
//               fullWidth
//               placeholder='Enter the price of the package'
//               {...register('price', {
//                 required: 'Price is required!',
//                 min: {
//                   value: 1,
//                   message: 'Price must be greater than 0'
//                 }
//               })}
//             />
//             {errors?.price && (
//               <FormHelperText error>{errors?.price?.message}</FormHelperText>
//             )}
//           </Box>
//           <Button
//             variant='contained'
//             sx={{
//               padding: '5px'
//             }}
//             onClick={handleSubmit(addOnePackage)}
//           >
//             Add Package
//           </Button>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default Packages;






import React, { useEffect, useState } from 'react';
import { addPackage, deletePackage, getAllPackages } from '../../actions/admin';
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
  Checkbox,
} from '@mui/material';
import { Tour, DeleteForever,Copyright, CurrencyRupee } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import Coin from './Coin.jsx'

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

const Packages = () => {
  const { token } = useSelector(state => state.userSlice);
  const [packages, setPackages] = useState([]);
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
      name: '',
      coins: 0,
      price: '',
    }
  });

  const isPremium = watch('is_premium');

  const fetchPackages = async () => {
    const resp = await getAllPackages({ token });
    setPackages(resp?.packages ?? []);
  };

  const deleteOnePackage = async id => {
    setLoading(true);
    await deletePackage({ token, id });
    await fetchPackages();
    setLoading(false);
  };

  const addOnePackage = async data => {
    setLoading(true);
    await addPackage({ token, data });
    await fetchPackages();
    reset({
      name: '',
      price: '',
      coins: 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
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
          All Packages
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column'
          }}
        >
          {packages.map(pack => (
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
                onClick={() => deleteOnePackage(pack._id)}
                sx={{
                  position: 'absolute',
                  right: '0px',
                  top: '0px',
                  color: 'red'
                }}
              >
                <DeleteForever />
              </IconButton>
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  mb: '5px'
                }}
              >
                {pack.name}&nbsp;
              </Typography>
              <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid display={'flex'} gap='10px' alignItems={'center'}>
                  <Typography>Coins -</Typography>
                  {/* <Typography
                    fontWeight={'600'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    {pack?.red}&nbsp;
                    <Tour
                      sx={{
                        color: '#fa1942'
                      }}
                    />
                  </Typography> */}

                  {/* <Typography
                    fontWeight={'600'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  > */}
                    {/* {pack?.green}&nbsp;{' '}
                    <Tour
                      sx={{
                        color: '#76de9a'
                      }}
                    /> */}
                  {/* </Typography> */}
                  <Typography
                    fontWeight={'600'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    {pack?.coins}&nbsp;{' '}
                    {/* <Copyright
                      sx={{
                        color: '#fac219'
                      }}
                    /> */}
                    <Coin />
                  </Typography>
                </Grid>
                <Typography fontWeight={'600'}>Rs. {pack.price}</Typography>
              </Grid>
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
          Add a new Package
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <Box>
            <Label>Name</Label>
            <TextField
              fullWidth
              placeholder='Enter the package name'
              {...register('name', { required: 'Name is required!' })}
            />
            {errors?.name && (
              <FormHelperText error>{errors?.name?.message}</FormHelperText>
            )}
          </Box>
          <Box>
            {/* <Label>Coins:</Label> */}
            <Grid
              sx={{
                display: 'flex',
                gap: '10px'
              }}
            >
              {/* <Box>
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Red{' '}
                  <Tour
                    sx={{
                      color: '#fa1942'
                    }}
                  />
                </Typography>
                <NumberTextField
                  type='number'
                  inputProps={{
                    min: 0
                  }}
                  sx={{
                    width: '100px'
                  }}
                  defaultValue={0}
                  {...register('red', { required: true })}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Green{' '}
                  <Tour
                    sx={{
                      color: '#76de9a'
                    }}
                  />
                </Typography>
                <NumberTextField
                  type='number'
                  inputProps={{
                    min: 0
                  }}
                  min={0}
                  sx={{
                    width: '100px'
                  }}
                  defaultValue={0}
                  {...register('green', { required: true })}
                />
              </Box> */}
              <Box>
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0px'
                  }}
                >
                  <b>Coins</b>
                  {/* yeha h */}

                  {/* <Copyright
                    sx={{
                      color: '#fac219',
                      paddingLeft:'5px'
                    }}
                  /> */}
                <Coin size="5rem" />
                  
                </Typography>
                <NumberTextField
                  type='number'
                  inputProps={{
                    min: 0
                  }}
                  sx={{
                    width: '100px'
                  }}
                  defaultValue={0}
                  {...register('coins', { required: true })}
                />
              </Box>
            </Grid>
          </Box>
          <Box>
            <Label>Price (in Rupees)</Label>
            <TextField
              fullWidth
              placeholder='Enter the price of the package'
              {...register('price', {
                required: 'Price is required!',
                min: {
                  value: 1,
                  message: 'Price must be greater than 0'
                }
              })}
            />
            {errors?.price && (
              <FormHelperText error>{errors?.price?.message}</FormHelperText>
            )}
          </Box>
          <Button
            variant='contained'
            sx={{
              padding: '5px'
            }}
            onClick={handleSubmit(addOnePackage)}
          >
            Add Package
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Packages;
