import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";

const CreatePropertyUsageTypesForm = ({ onPropertyUsageTypeCreated }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const formik = useFormik({
    initialValues: {
      propertyUsageType: "",
      submit: null,
    },
    validationSchema: Yup.object({
      propertyUsageType: Yup.string().max(255).required("field can't be empty"),
    }),

    onSubmit: async (values, helpers) => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      const createPropertyUsageTypeConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/propertyUsage/createPropertyUsage`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          propertyUsage: values.propertyUsageType,
        },
        withCredentials: true,
      };

      try {
        const res = await axios(createPropertyUsageTypeConfig);
        console.log("Successfully created new property usage type: ", res);
        onPropertyUsageTypeCreated();
      } catch (err) {
        console.log("Issue creating new property usage type: ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Create Property Usage Type</title>
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
              <Typography variant="h4">Create New Property Usage Type</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.propertyUsageType && formik.errors.propertyUsageType)}
                  fullWidth
                  helperText={formik.touched.propertyUsageType && formik.errors.propertyUsageType}
                  label="Property Usage Type"
                  name="propertyUsageType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.propertyUsageType}
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

export default CreatePropertyUsageTypesForm;
