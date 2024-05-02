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
import { Field } from 'formik';

const AdditionalInformation = (props) => {
  const { formik } = props;

  return (
    <form
      autoComplete="off"
      noValidate
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Additional Information"
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
                  error={!!(formik.touched.propertyTitle && formik.errors.propertyTitle)}
                  fullWidth
                  helperText={formik.touched.propertyTitle && formik.errors.propertyTitle}
                  label="Property Title"
                  name="propertyTitle"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.propertyTitle}
                />
                {/* <Field name="agreeToTerms">
                  {({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                </Field> */}
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
               <TextField
                  error={!!(formik.touched.additionalDetails && formik.errors.additionalDetails)}
                  fullWidth
                  helperText={formik.touched.additionalDetails && formik.errors.additionalDetails}
                  label="Addition Details"
                  name="additionalDetails"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  multiline
                  rows={4}
                  value={formik.values.additionalDetails}
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

export default AdditionalInformation;
