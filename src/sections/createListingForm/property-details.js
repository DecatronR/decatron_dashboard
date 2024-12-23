import { useCallback, useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import { Field } from "formik";
import { legalDocuments, numberOf } from "src/components/database/create-listing";

const PropertyDetails = (props) => {
  const { formik } = props;

  const handleFieldChange = (field) => (e) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal
    formik.setFieldValue(field, numericValue);
  };

  const handleFieldBlur = (field) => () => {
    const formattedValue = formatPrice(formik.values[field]);
    formik.setFieldValue(field, formattedValue);
  };

  const formatPrice = (price) => {
    if (!price) return "₦0.00";
    return `₦${parseFloat(price).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card>
      <CardHeader subheader="The information can be edited" title="Property Details" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
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
            <Grid xs={12} md={6}>
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
                <MenuItem value="">Select Number of Bedrooms</MenuItem>
                {numberOf.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <Select
                error={!!(formik.touched.kitchens && formik.errors.kitchens)}
                fullWidth
                helperText={formik.touched.kitchens && formik.errors.kitchens}
                label="Bathroom(s)"
                name="kitchens"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.kitchens}
                displayEmpty
              >
                <MenuItem value="">Select Number of Bathrooms</MenuItem>
                {numberOf.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.Price && formik.errors.Price)}
                fullWidth
                helperText={formik.touched.Price && formik.errors.Price}
                label="Price"
                name="Price"
                placeholder="0.00"
                onBlur={(e) => {
                  formik.handleBlur(e); // Pass the event to handleBlur
                  handleFieldBlur("Price")(); // Format the price on blur
                }}
                onChange={handleFieldChange("Price")}
                type="text"
                value={formik.values.Price}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.inspectionFee && formik.errors.inspectionFee)}
                fullWidth
                helperText={formik.touched.inspectionFee && formik.errors.inspectionFee}
                label="Inspection Fee"
                name="inspectionFee"
                placeholder="0.00"
                onBlur={(e) => {
                  formik.handleBlur(e); // Pass the event to handleBlur
                  handleFieldBlur("inspectionFee")(); // Format the inspection fee on blur
                }}
                onChange={handleFieldChange("inspectionFee")}
                type="text"
                value={formik.values.inspectionFee}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default PropertyDetails;
