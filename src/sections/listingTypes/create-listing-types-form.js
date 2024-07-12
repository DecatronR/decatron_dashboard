import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CreateListingTypesForm = ({ onListingTypeCreated }) => {

  const formik = useFormik({
    initialValues: {
      listingType: '',
      submit: null
    },
    validationSchema: Yup.object({
      listingType: Yup
        .string()
        .max(255)
        .required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {

        const createListingTypeConfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/listingType/createListingType',
          headers: { },
          data : {
            listingType: values.listingType,
          },
          withCredentials: true,
        }

        try {
          const res = await axios(createListingTypeConfig);
          console.log("Successfully created listing type: ", res);
          onListingTypeCreated();
          if(res.statusText === "Created") {
            helpers.setStatus({ success: true });
          }
        } catch(error) {
          console.log("Issue with creating new listing type: ", err);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
    }
  });

  return (
    <>
      <Head>
        <title>
          Create Listing Type
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Create New Listing Type
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
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
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Create
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CreateListingTypesForm;
