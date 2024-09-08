import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import * as Yup from "yup";
import { Box, Button, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const { signIn } = useAuthContext();
  const [method, setMethod] = useState("email");

  const handleOtpResend = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/resendOTP", {
        withCredentials: true,
      });
      console.log("OTP resent", res.data);
    } catch (error) {
      console.log("Error resending OTP", error);
      helpers.setStatus({ success: false });
      const errorMessage =
        err.response?.data?.message || "Something went wrong. Please try again later.";
      helpers.setErrors({ submit: errorMessage });
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const res = await signIn(values.email, values.password);
        console.log("response: ", res);
        router.push("/");
      } catch (err) {
        let errorMessages = [];
        let responseMessage =
          err.response?.data?.responseMessage || "An error occurred. Please try again.";
        let responseCode = err.response?.data.responseCode;
        console.log("err: ", err);
        console.log("response message: ", responseMessage);

        if (Array.isArray(responseMessage)) {
          errorMessages = responseMessage.map((errMsg) => errMsg.msg);
        } else {
          errorMessages.push(responseMessage);
        }
        if (responseCode === 402) {
          console.log("No Otp yet");
          await handleOtpResend();
          sessionStorage.setItem("email", values.email);
          sessionStorage.setItem("password", values.password);
          router.replace("/auth/otp");
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: responseMessage });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 550,
          px: 3,
          py: "100px",
          width: "100%",
        }}
      >
        <div>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Login</Typography>
          </Stack>
          <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
            <Tab label="Email" value="email" />
          </Tabs>
          {method === "email" && (
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

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
