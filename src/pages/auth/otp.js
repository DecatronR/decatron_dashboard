import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, Tab, Tabs, TextField, Typography, Link } from '@mui/material';

const OtpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [method, setMethod] = useState('otp');

  useEffect(() => {
    if(router.query.email) {
        setEmail(router.query.email) 
    }
  },[router.query.email]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; 
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
  };

  const handleOtpResend = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/resendOTP");
      console.log("OTP resent", res.data);
    } catch (error) {
      console.log("Error resending OTP", error);
      helpers.setStatus({ success: false });
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again later.';
      helpers.setErrors({ submit: errorMessage });
      helpers.setSubmitting(false);
    }
  }; 

  const handleOtpSubmit = async (values, helpers) => {
    const otp = otpValues.join('');
    if(!email) {
        console.log("Could not fetch your email")
        helpers.setErrors({ submit: 'Could not fetch your email.' });
        return
    }

    if (otp.length === 6) {
      
      try {
       const res =  await axios.post("http://localhost:8080/auth/confirmOTP", { email: email, otp: otp}, {withCredentials: true})
        console.log('Verifying OTP:', res);
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again later.';
        helpers.setErrors({ submit: errorMessage });
        helpers.setSubmitting(false);
      }
    } else {
      helpers.setErrors({ submit: 'Please fill all OTP fields.' });
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: '',
      submit: null
    },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required')
    }),
    onSubmit: handleOtpSubmit
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
            <Typography variant="h4">Enter OTP</Typography>
          </Stack>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We have sent an OTP to your email <strong>{email}</strong>. Please check your inbox.
          </Typography>
          <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
            <Tab label="OTP" value="otp" />
          </Tabs>
          {method === 'otp' && (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3} direction="row" justifyContent="space-between">
                {otpValues.map((value, index) => (
                  <TextField
                    key={index}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    inputProps={{ maxLength: 1 }}
                    sx={{ width: 50 }}
                  />
                ))}
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Didn't receive the OTP?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleOtpResend}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Resend OTP
                </Link>
              </Typography>
            </form>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default OtpPage;
