import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { Box, Container, Stack, Typography, Button, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import BasicInformation from "src/sections/createListingForm/basic-information";
import PropertyDetails from "src/sections/createListingForm/property-details";
import PropertyMedia from "src/sections/createListingForm/property-media";

const CreateListing = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyUsageTypes, setPropertyUsageTypes] = useState([]);
  const [propertyConditions, setPropertyConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [localGovernment, setLocalGovernment] = useState([]);

  const fetchData = useCallback(async (url, setter) => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setter(res.data);
    } catch (err) {
      console.error(`Issue fetching data from ${url}:`, err);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(`${baseUrl}/propertyType/fetchPropertyType`, setPropertyTypes),
        fetchData(`${baseUrl}/listingType/fetchListingType`, setListingTypes),
        fetchData(`${baseUrl}/propertyUsage/fetchPropertyUsage`, setPropertyUsageTypes),
        fetchData(`${baseUrl}/propertyCondition/fetchPropertyCondition`, setPropertyConditions),
        fetchData(`${baseUrl}/state/fetchState`, setStates),
        fetchData(`${baseUrl}/lga/fetchLGA`, setLocalGovernment),
      ]);
    };

    fetchAllData();
  }, [fetchData]);

  const validationSchema = Yup.object().shape({
    propertyTitle: Yup.string().required("Property title is required"),
    propertyListingType: Yup.string().required("Property listing type is required"),
    propertyUsageType: Yup.string().required("Property usage type is required"),
    propertyType: Yup.string().required("Property type is required"),
    propertySubType: Yup.string().nullable(),
    state: Yup.string().required("State is required"),
    neighbourhood: Yup.string().required("Neighbourhood is required"),
    size: Yup.string(),
    propertyCondition: Yup.string(),
    propertyDescription: Yup.string(),
    livingRooms: Yup.number().nullable(),
    bedrooms: Yup.number(),
    kitchens: Yup.number(),
    parkingSpaces: Yup.number().nullable(),
    Price: Yup.string().required("Price is required"),
    inspectionFee: Yup.string(),
    photos: Yup.array().of(
      Yup.object().shape({
        path: Yup.string().required("Photo path is required"),
      })
    ),
    virtualTour: Yup.string().url("Invalid URL format"),
    video: Yup.string().url("Invalid URL format"),
  });

  const formik = useFormik({
    initialValues: {
      propertyTitle: "",
      propertyListingType: "",
      propertyUsageType: "",
      propertyType: "",
      propertySubType: "null",
      state: "",
      localGovernment: "",
      neighbourhood: "",
      size: "",
      propertyCondition: "",
      propertyDescription: "",
      livingRooms: "null",
      bedrooms: "",
      kitchens: "",
      parkingSpaces: "null",
      Price: "",
      inspectionFee: "",
      photos: [],
      virtualTour: "",
      video: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      console.log("Form submitted with values:", values);
      console.log("Formik errors:", formik.errors);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "photos" && Array.isArray(value)) {
          value.forEach((photo) => formData.append("photo", photo));
        } else {
          formData.append(key, value);
        }
      });

      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }

      try {
        helpers.setSubmitting(true);
        const response = await axios.post(
          `${baseUrl}/propertyListing/createPropertyListing`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        console.log("Successfully listed new property:", response);
        // Handle success
      } catch (error) {
        console.error("Error creating property listing:", error);
        helpers.setErrors({ submit: error.message });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Create New Listing | Decatron Dashboard</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Create a new property listing</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <form
                autoComplete="off"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(e);
                }}
              >
                <Stack spacing={3}>
                  <BasicInformation
                    formik={formik}
                    propertyTypes={propertyTypes}
                    listingTypes={listingTypes}
                    propertyUsageTypes={propertyUsageTypes}
                    propertyConditions={propertyConditions}
                    states={states}
                    localGovernment={localGovernment}
                  />
                  <PropertyDetails formik={formik} />
                  <PropertyMedia formik={formik} />
                  {formik.errors.submit && (
                    <Typography color="error" sx={{ mt: 3 }} variant="body2">
                      {formik.errors.submit}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    // disabled={formik.isSubmitting}
                    // onClick={formik.handleSubmit}
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CreateListing.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateListing;
