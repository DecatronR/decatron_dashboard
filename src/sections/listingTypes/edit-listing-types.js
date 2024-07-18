import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const EditListingTypes = ({ initialData, onSave, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      listingType: initialData || '',
      submit: null,
    },
    validationSchema: Yup.object({
      listingType: Yup.string().max(255).required("field can't be empty"),
    }),
    onSubmit: (values, helpers) => {
      onSave(values.listingType);
      helpers.setSubmitting(false);
    },
  });

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">Edit Listing Type</Typography>
      </Stack>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            error={!!(formik.touched.listingType && formik.errors.listingType)}
            fullWidth
            helperText={formik.touched.listingType && formik.errors.listingType}
            label="Listing Type"
            name="listingType"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.listingType}
          />
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 2 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default EditListingTypes;