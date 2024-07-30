import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography} from '@mui/material';
import axios from 'axios';

const CreatePropertyConditionsForm = ({ onPropertyConditionsCreated }) => {

  const formik = useFormik({
    initialValues: {
      propertyConditions: '',
      submit: null
    },
    validationSchema: Yup.object({
      propertyConditions: Yup
        .string()
        .max(255)
        .required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {
      const createPropertyTypeConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/propertyType/createPropertyType',
        headers: { },
        data : {
          propertyConditions: values.propertyConditions,
        },
        withCredentials: true,
      };

      try {
        const res = await axios(createPropertyConditionsConfig)
        console.log("Succesfully created new property condition: ", res);
        onPropertyConditionsCreated();
      } catch (err) {
        console.log("Issue creating new property condition: ", err);
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
          Create Property Type
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
                Create New Property Condition
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.propertyConditions && formik.errors.propertyCondition)}
                  fullWidth
                  helperText={formik.touched.propertyConditions && formik.errors.propertyCondition}
                  label="Property Conditon"
                  name="propertyCondition"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.propertyConditions}
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

export default CreatePropertyConditionsForm;
