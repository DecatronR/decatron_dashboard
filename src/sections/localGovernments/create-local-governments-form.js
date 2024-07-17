import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CreateLocalGovernmentsForm = ({ onLocalGovernmentCreated }) => {

  const formik = useFormik({
    initialValues: {
      localGovernment: '',
      submit: null
    },
    validationSchema: Yup.object({
      localGovernment: Yup
        .string()
        .max(255)
        .required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Create button clicked");
      const localGovernmentData = {
         stateId: "6638c2ea07655b777b920fe5", // fetch stateId and pass it here
          lga: values.localGovernment
      }
        const createLocalGovernmentConfig = {
        method: 'post',
        maxBodyLength: Infinity,
          url: 'http://localhost:8080/lga/createLGA',
          headers: { },
          data : localGovernmentData,
          withCredentials: true,
        }

        try {
          const res = await axios(createLocalGovernmentConfig);
          console.log("Succesfully created new property types: ", res);
        } catch(err) {
          console.log("Issue creating new LGA type: ", err);
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
          Create New LGA
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
                Create New LGA
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.localGovernment && formik.errors.localGovernment)}
                  fullWidth
                  helperText={formik.touched.localGovernment && formik.errors.localGovernment}
                  label="Local Government"
                  name="localGovernment"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.localGovernment}
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

export default CreateLocalGovernmentsForm;
