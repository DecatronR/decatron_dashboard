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
import { legalDocuments, numberOf } from 'src/components/database/create-listing';

const PropertyDetails = (props) => {
  const { formik, handleNextBtn, handleBackBtn } = props;

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
  };

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Property Details"
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
                  error={!!(formik.touched.propertyDescription && formik.errors.propertyDescription)}
                  fullWidth
                  helperText={formik.touched.propertyDescription && formik.errors.propertyDescription}
                  label="Property Description"
                  name="propertyDescription"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  multiline
                  rows={4}
                  value={formik.values.propertyDescription}
                /> 
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Select
                  error={!!(formik.touched.livingRooms && formik.errors.livingRooms)}
                  fullWidth
                  helperText={formik.touched.livingRooms && formik.errors.livingRooms}
                  label="Living Room(s)"
                  name="livingRooms"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.livingRooms}
                  displayEmpty
                >
                  <MenuItem value="">
                    Select Number of Living Rooms
                  </MenuItem>
                  {numberOf.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>  
              <Grid
                xs={12}
                md={6}
              >
                <Select
                  error={!!(formik.touched.bedrooms && formik.errors.bedrooms)}
                  fullWidth
                  helperText={formik.touched.bedrooms && formik.errors.bedrooms}
                  label="Bedroom(s)"
                  name="bedrooms"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.bedrooms}
                  displayEmpty
                >
                  <MenuItem value="">
                    Select Number of Bedrooms
                  </MenuItem>
                  {numberOf.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Select
                  error={!!(formik.touched.kitchens && formik.errors.kitchens)}
                  fullWidth
                  helperText={formik.touched.kitchens && formik.errors.kitchens}
                  label="Kitchen(s)"
                  name="kitchens"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.kitchens}
                  displayEmpty
                >
                  <MenuItem value="">
                    Select Number of Kitchens
                  </MenuItem>
                  {numberOf.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Select
                  error={!!(formik.touched.parkingSpaces && formik.errors.parkingSpaces)}
                  fullWidth
                  helperText={formik.touched.parkingSpaces && formik.errors.parkingSpaces}
                  label="Parking Space(s)"
                  name="parkingSpaces"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.parkingSpaces}
                  displayEmpty
                >
                  <MenuItem value="">
                    Select Number of Packing Spaces
                  </MenuItem>
                  {numberOf.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.price && formik.errors.price)}
                  fullWidth
                  helperText={formik.touched.price && formik.errors.price}
                  label="Price"
                  name="price"
                  onBlur={formik.handleBlur}
                  onChange={handlePriceChange}
                  type="text"
                  value={formik.values.price}
                /> 
              </Grid>
              <Grid>
                {/* <Field name="legalDocuments">
                  {({ field }) => (
                    <>
                      {legalDocuments.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              checked={field.value.includes(option.value)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const newValue = isChecked
                                  ? [...field.value, option.value]
                                  : field.value.filter((value) => value !== option.value);
                                formik.setFieldValue('legalDocuments', newValue);
                              }}
                              value={option.value}
                            />
                          }
                          label={option.label}
                        />
                      ))}
                    </>
                  )}
                </Field> */}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
      </Card>
    </form>
  );
};

export default PropertyDetails;
