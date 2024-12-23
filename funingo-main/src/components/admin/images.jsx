import React, { useEffect, useState } from 'react';
import {
  addImages,
  deleteImage,
  getAllImages,
  uploadImages
} from '../../actions/admin';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  IconButton,
  Typography,
  styled,
  Button,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  DeleteForever,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import Select from 'react-select';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const Images = () => {
  const { token } = useSelector(state => state.userSlice);
  const dispatch = useDispatch();
  const { images } = useSelector(state => state.appSlice);
  const [loading, setLoading] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageType, setImageType] = useState(null);

  const imageTypes = [
    {
      label: 'Banner',
      value: 'banner'
    },
    {
      label: 'Sport Event',
      value: 'sport_event'
    },
    {
      label: 'Birthdat Party',
      value: 'birthday_party'
    },
    {
      label: 'Corporate Event',
      value: 'corporate_event'
    }
  ];

  const uploadImage = async imagesToUpload => {
    const formdata = new FormData();

    for (let i = 0; i < imagesToUpload.length; i++) {
      formdata.append(`image`, imagesToUpload[i]);
    }

    setImagesUploading(true);
    const resp = await uploadImages({
      token,
      data: formdata
    });
    setUploadedImages(curr => [...curr, ...(resp?.images || [])]);
    setImagesUploading(false);
  };

  const deleteImageFromDB = async id => {
    setLoading(true);
    await deleteImage({ token, id });
    dispatch(getAllImages());
    setLoading(false);
  };

  const addImagesToDB = async () => {
    setLoading(true);
    const data = {
      images: uploadedImages.map(img => ({
        image_type: imageType.value,
        url: img.url,
        filename: img.filename
      }))
    };
    await addImages({ token, data });
    dispatch(getAllImages());
    setLoading(false);
    setUploadedImages([]);
    setImageType(null);
  };

  useEffect(() => {
    dispatch(getAllImages());
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
          All Images
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            gap: '10px',
            flexDirection: 'column'
          }}
        >
          {images.banner?.length > 0 && (
            <Box>
              <Typography fontSize={'18px'} fontWeight={'600'}>
                Banner
              </Typography>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {images.banner?.map(image => (
                  <Box key={image._id} position='relative'>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px'
                      }}
                      onClick={() => deleteImageFromDB(image._id)}
                    >
                      <DeleteForever />
                    </IconButton>
                    <Box component={'img'} src={image.url} width='200px' />
                  </Box>
                ))}
              </Grid>
            </Box>
          )}
          {images.corporateEvent?.length > 0 && (
            <Box>
              <Typography fontSize={'18px'} fontWeight={'600'}>
                Corporate Event
              </Typography>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {images.corporateEvent?.map(image => (
                  <Box key={image._id} position='relative'>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px'
                      }}
                      onClick={() => deleteImageFromDB(image._id)}
                    >
                      <DeleteForever />
                    </IconButton>
                    <Box component={'img'} src={image.url} width='200px' />
                  </Box>
                ))}
              </Grid>
            </Box>
          )}
          {images.sportEvent?.length > 0 && (
            <Box>
              <Typography fontSize={'18px'} fontWeight={'600'}>
                Sport Event
              </Typography>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {images.sportEvent?.map(image => (
                  <Box key={image._id} position='relative'>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px'
                      }}
                      onClick={() => deleteImageFromDB(image._id)}
                    >
                      <DeleteForever />
                    </IconButton>
                    <Box component={'img'} src={image.url} width='200px' />
                  </Box>
                ))}
              </Grid>
            </Box>
          )}
          {images.weddingEvent?.length > 0 && (
            <Box>
              <Typography fontSize={'18px'} fontWeight={'600'}>
                Wedding Event
              </Typography>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {images.weddingEvent?.map(image => (
                  <Box key={image._id} position='relative'>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px'
                      }}
                      onClick={() => deleteImageFromDB(image._id)}
                    >
                      <DeleteForever />
                    </IconButton>
                    <Box component={'img'} src={image.url} width='200px' />
                  </Box>
                ))}
              </Grid>
            </Box>
          )}
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
          Add new Images
        </Typography>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '300px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <Button
              component='label'
              variant='outlined'
              startIcon={<CloudUploadIcon />}
              disabled={imagesUploading}
            >
              {imagesUploading ? (
                <CircularProgress
                  sx={{
                    width: '24.5px !important',
                    height: '24.5px !important'
                  }}
                />
              ) : (
                <Box>
                  Upload Images
                  <VisuallyHiddenInput
                    type='file'
                    multiple
                    onChange={e => uploadImage(e.target.files)}
                  />
                </Box>
              )}
            </Button>
            {uploadedImages?.length > 0 && (
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  mb: '20px'
                }}
              >
                <Typography fontSize={'16px'} fontWeight={'600'}>
                  Uploaded Images
                </Typography>
                <Grid
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}
                >
                  {uploadedImages?.map?.(image => (
                    <Box component={'img'} src={image.url} width='150px' />
                  ))}
                </Grid>
              </Grid>
            )}
            {uploadedImages?.length > 0 && (
              <Grid>
                <Typography fontSize={'16px'} fontWeight={'600'} mb='10px'>
                  Image Type
                </Typography>
                <Select
                  options={imageTypes}
                  onChange={val => setImageType(val)}
                  value={imageType}
                />
                <Button
                  variant='contained'
                  fullWidth
                  sx={{
                    marginTop: '10px'
                  }}
                  onClick={addImagesToDB}
                >
                  Add Images
                </Button>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Images;
