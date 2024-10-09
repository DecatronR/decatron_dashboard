import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, Tab, Tabs, TextField, Typography, Link } from "@mui/material";
import axios from "axios";
import { useAuthContext } from "src/contexts/auth-context";

const OtpPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { otpAuth, signIn } = useAuthContext();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [method, setMethod] = useState("otp");

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (email && password) {
      setEmail(email);
      setPassword(password);
    }
  }, []);

  const handleOtpResend = async () => {
    try {
      const res = await axios.get(`${baseUrl}/auth/resendOTP`);
      console.log("OTP resent", res.data);
    } catch (error) {
      console.log("Error resending OTP", error);
    }
  };

  const handleOtpSubmit = async (values, helpers) => {
    const otp = values.otp.join("");
    if (!email) {
      helpers.setErrors({ submit: "Could not fetch your email." });
      return;
    }

    if (otp.length === 6) {
      try {
        await otpAuth(email, otp);
        await signIn(email, password);
        router.replace("/");
      } catch (err) {
        helpers.setStatus({ success: false });
        const errorMessage =
          err.response?.data?.message || "Something went wrong. Please try again later.";
        helpers.setErrors({ submit: errorMessage });
        helpers.setSubmitting(false);
      }
    } else {
      helpers.setErrors({ submit: "Please fill all OTP fields." });
    }
  };

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
      submit: null,
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().required("Each OTP field is required").matches(/^\d$/, "Must be a number"))
        .min(6, "OTP must be 6 digits")
        .required("OTP is required"),
    }),
    onSubmit: handleOtpSubmit,
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
            <Typography variant="h4">Enter OTP</Typography>
          </Stack>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We have sent an OTP to your email <strong>{email}</strong>. Please check your inbox.
          </Typography>
          <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
            <Tab label="OTP" value="otp" />
          </Tabs>
          {method === "otp" && (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3} direction="row" justifyContent="space-between">
                {formik.values.otp.map((value, index) => (
                  <TextField
                    key={index}
                    value={value}
                    onChange={(e) => {
                      const otp = [...formik.values.otp];
                      otp[index] = e.target.value;
                      formik.setFieldValue("otp", otp); // Update formik state
                    }}
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
                {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Didn't receive the OTP?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleOtpResend}
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
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
