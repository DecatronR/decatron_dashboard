import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CreateRoleForm = ({ onRoleCreated }) => {

  const formik = useFormik({
    initialValues: {
      role: '',
      submit: null
    },
    validationSchema: Yup.object({
      role: Yup
        .string()
        .max(255)
        .required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {
        console.log("Created new role");

        const createRoleConfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/role/createRole',
          headers: { },
          data : values.role,
        };

        try {
          const res = await axios(createRoleConfig);
          console.log("Succesfully created new role: ", res);
        } catch (error) {
          console.log("Issue with creating role: ", error);
        }
    }
  });

  return (
    <>
      <Head>
        <title>
          Create New Role
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
                Create New Role
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.role && formik.errors.role)}
                  fullWidth
                  helperText={formik.touched.role && formik.errors.role}
                  label="Role"
                  name="role"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.role}
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

export default CreateRoleForm;
