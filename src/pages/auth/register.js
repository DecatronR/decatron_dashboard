import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from "@mui/material";
import { useAuthContext } from "src/contexts/auth-context";
import { Layout as AuthLayout } from "src/layouts/auth/layout";

const Page = () => {
  const router = useRouter();
  const { signUp } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "08011122233",
      role: "",
      password: "",
      confirmpassword: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await signUp(
          values.name,
          values.email,
          values.phone,
          values.role,
          values.password,
          values.confirmpassword
        );
        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("password", values.password);
        router.replace("/auth/otp");
      } catch (err) {
        let errorMessages = [];
        let responseMessage =
          err.response?.data?.responseMessage || "An error occurred. Please try again.";
        if (Array.isArray(responseMessage)) {
          errorMessages = responseMessage.map((errMsg) => errMsg.msg);
        } else {
          errorMessages.push(responseMessage);
        }
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: errorMessages });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Decatron Dashboard</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
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
                  name="role"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.role}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    Select Role
                  </MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
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
                  error={!!(formik.touched.confirmpassword && formik.errors.confirmpassword)}
                  fullWidth
                  helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
                  label="Confirm Password"
                  name="confirmpassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmpassword}
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
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
