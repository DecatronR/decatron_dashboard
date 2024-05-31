import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { CreateUserDB } from 'src/components/database/create-user';
import axios from 'axios';

const CreateUserForm = () => {

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'agent', label: 'Agent' },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: '',
      submit: null
    },
    validationSchema: Yup.object({
      firstName: Yup
        .string()
        .max(255)
        .required('First Name is required'),
      lastName: Yup
        .string()
        .max(255)
        .required('Last Name is required'),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      role: Yup
        .string()
        .required('Please select a role'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),

    onSubmit: async (values, helpers) => {
      const currentDate = new Date();

      const dd = String(currentDate.getDate()).padStart(2, '0');
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const yyyy = currentDate.getFullYear();

      const formattedDate = `${dd}/${mm}/${yyyy}`;

  console.log(formattedDate);
      console.log(`Create user form details: `, `Name: ${values.firstName} ${values.lastName}, Email: ${values.email}, Role: ${values.role}`);

      const userData =  {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: "553-481-3641",
        role: values.role,
        password: values.password,
        confirmpassword: values.confirmPassword
      }
      const createUserconfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/auth/register',
        headers: { },
        data: userData,
      }
      try {
        const res = await axios(createUserconfig);
        console.log("Succesfully created new user: ", res);
        if(res.statusText === "OK") {
          helpers.setStatus({ success: true });
        }
        // await CreateUserDB.userDetails.add({
        //   name: `${values.firstName} ${values.lastName}`,
        //   email: values.email,
        //   role: values.role,
        //   date: formattedDate,
        // });
      } catch (err) {
        console.log("There was an issue with adding user to database: ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }

      const fetchUserConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/users/getusers',
        headers: { }
      }

      try {
        const res = await axios(fetchUserConfig)
        console.log("Succesfully fethced user data: ", res);
      } catch(err) {
        console.log("There was an issue fetching user data: ", err);
      }
    }
  });

  


  

  const handleRoleChange = (event) => {
    event.preventDefault();
    const selectedRole = event.target.value;
    formik.setFieldValue('role', selectedRole);
  }

  return (
    <>
      <Head>
        <title>
          Create New User
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
                Create New User
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.firstName && formik.errors.firstName)}
                  fullWidth
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  label="First Name"
                  name="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.firstName}
                />
                 <TextField
                  error={!!(formik.touched.lastName && formik.errors.lastName)}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Last Name"
                  name="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.lastName}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                /> 
                <Select
                  error={!!(formik.touched.role && formik.errors.role)}
                  fullWidth
                  helperText={formik.touched.role && formik.errors.role}
                  label="Role"
                  name="role"
                  onBlur={formik.handleBlur}
                  onChange={handleRoleChange}
                  value={formik.values.role}
                  displayEmpty
                  >
                    <MenuItem disabled value="">
                      Select Role
                    </MenuItem>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                /> 
                 <TextField
                  error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  fullWidth
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  label="Confirm Password"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmPassword}
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
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CreateUserForm;
