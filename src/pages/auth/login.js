import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useAuthContext } from 'src/contexts/auth-context';

const Page = () => {
  const router = useRouter();
  const { signIn } = useAuthContext();
  const [method, setMethod] = useState('email');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email, values.password);
        router.push('/');
      } catch (err) {
        let errorMessages = [];
        if (Array.isArray(err.response?.data?.responseMessage)) {
          errorMessages = err.response.data.responseMessage.map(errMsg => errMsg.msg);
        } else {
          errorMessages.push(err.response?.data?.responseMessage || 'An error occurred. Please try again.');
        }
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: errorMessages.join(' ') });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
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
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Login</Typography>
          </Stack>
          <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
            <Tab label="Email" value="email" />
          </Tabs>
          {method === 'email' && (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
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
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default Page;
