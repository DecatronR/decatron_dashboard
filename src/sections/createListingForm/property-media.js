import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem
} from '@mui/material';

const PropertyMedia = (props) => {
  const { formik } = props;

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = numeral(value).format('₦0,0.00');
    formik.setFieldValue(name, formattedValue);
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Property Media"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
               <Grid
                xs={12}
                md={6}
              >
                 <TextField
                  error={!!(formik.touched.photos && formik.errors.photos)}
                  fullWidth
                  helperText={formik.touched.photos && formik.errors.photos}
                  label="Photos"
                  name="photos"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="file"
                  inputProps={{ multiple: true }}
                  style={{ cursor: 'pointer' }} 
                /> 
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
               <TextField
                  error={!!(formik.touched.virtualTour && formik.errors.virtualTour)}
                  fullWidth
                  helperText={formik.touched.virtualTour && formik.errors.virtualTour}
                  label="Virtual Tour"
                  placeholder='https://link-to-virtual-tour.example'
                  name="virtualTour"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.virtualTour}
                /> 
              </Grid>  
              <Grid
                xs={12}
                md={6}
              >
               <TextField
                  error={!!(formik.touched.video && formik.errors.video)}
                  fullWidth
                  helperText={formik.touched.video && formik.errors.video}
                  label="Video"
                  placeholder='https://link-to-video.example'
                  name="video"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.video}
                /> 
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Back
          </Button>
          <Button variant="contained">
            Save and Continue
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default PropertyMedia;
