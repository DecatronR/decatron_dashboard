import { useCallback, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";

const BasicInformation = (props) => {
  const {
    formik,
    propertyTypes,
    listingTypes,
    propertyUsageTypes,
    propertyConditions,
    states,
    localGovernment,
  } = props;

  return (
    <Card>
      <CardHeader subheader="The information can be edited" title="Basic Information" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.propertyTitle && formik.errors.propertyTitle)}
                fullWidth
                helperText={formik.touched.propertyTitle && formik.errors.propertyTitle}
                label="Property Title"
                name="propertyTitle"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.propertyTitle}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.propertyListingType && formik.errors.propertyListingType)}
                fullWidth
                helperText={formik.touched.propertyListingType && formik.errors.propertyListingType}
                name="propertyListingType"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.propertyListingType}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select Listing Type
                </MenuItem>
                {listingTypes.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.listingType}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.propertyUsageType && formik.errors.propertyUsageType)}
                fullWidth
                helperText={formik.touched.propertyUsageType && formik.errors.propertyUsageType}
                label="Property Usage Type"
                name="propertyUsageType"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.propertyUsageType}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select Usage Type
                </MenuItem>
                {propertyUsageTypes.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.propertyUsage}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.propertyType && formik.errors.propertyType)}
                fullWidth
                helperText={formik.touched.propertyType && formik.errors.propertyType}
                name="propertyType"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.propertyType}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select Property Type
                </MenuItem>
                {propertyTypes.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.propertyType}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.propertyCondition && formik.errors.propertyCondition)}
                fullWidth
                helperText={formik.touched.propertyCondition && formik.errors.propertyCondition}
                label="Property Condition"
                name="propertyCondition"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.propertyCondition}
                displayEmpty
              >
                <MenuItem value="">Select Property Condition</MenuItem>
                {propertyConditions.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.propertyCondition}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.state && formik.errors.state)}
                fullWidth
                helperText={formik.touched.state && formik.errors.state}
                name="state"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.state}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select State
                </MenuItem>
                {states.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.state}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.localGovernment && formik.errors.localGovernment)}
                fullWidth
                helperText={formik.touched.localGovernment && formik.errors.localGovernment}
                name="localGovernment"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.localGovernment}
                displayEmpty
              >
                <MenuItem disabled value="">
                  Select LGA
                </MenuItem>
                {localGovernment.map((option) => (
                  <MenuItem key={option._id} value={option.slug}>
                    {option.lga}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.neighbourhood && formik.errors.neighbourhood)}
                fullWidth
                helperText={formik.touched.neighbourhood && formik.errors.neighbourhood}
                label="Neighbourhood"
                name="neighbourhood"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.neighbourhood}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.size && formik.errors.size)}
                fullWidth
                helperText={formik.touched.size && formik.errors.size}
                label="Size(sqm)"
                name="size"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.size}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default BasicInformation;
