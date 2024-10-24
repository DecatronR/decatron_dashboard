import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography, Select, MenuItem } from "@mui/material";
import axios from "axios";

const CreateRoleForm = ({ onRoleCreated }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const formik = useFormik({
    initialValues: {
      role: "",
      submit: null,
    },
    validationSchema: Yup.object({
      role: Yup.string().max(255).required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      const createRoleConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/role/createRole`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          roleName: values.role,
        },
        withCredentials: true,
      };

      try {
        const res = await axios(createRoleConfig);
        console.log("Successfully created new role: ", res);
        onRoleCreated();
      } catch (error) {
        console.log("Issue with creating role: ", error);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Create New Role</title>
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
              <Typography variant="h4">Create New Role</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
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
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
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
