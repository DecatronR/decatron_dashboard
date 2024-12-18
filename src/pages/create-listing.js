import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import BasicInformation from "src/sections/createListingForm/basic-information";
import PropertyDetails from "src/sections/createListingForm/property-details";
import PropertyMedia from "src/sections/createListingForm/property-media";

const steps = ["Basic Information", "Property Details", "Property Media"];

const CreateListing = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyUsageTypes, setPropertyUsageTypes] = useState([]);
  const [propertyConditions, setPropertyConditions] = useState([]);
  const [states, setStates] = useState([]);
  const [localGovernment, setLocalGovernment] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBackBtn = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const basicInformationValidationSchema = Yup.object().shape({
    propertyTitle: Yup.string().required("Property title is required"),
    propertyListingType: Yup.string().required("Property listing type is required"),
    propertyUsageType: Yup.string().required("Property usage type is required"),
    propertyType: Yup.string().required("Property type is required"),
    propertySubType: Yup.string(),
    state: Yup.string().required("State is required"),
    neighbourhood: Yup.string().required("Neighbourhood is required"),
    size: Yup.string(),
    propertyCondition: Yup.string(),
  });

  const propertyDetailsValidationSchema = Yup.object().shape({
    propertyDescription: Yup.string(),
    livingRooms: Yup.number(),
    bedrooms: Yup.number(),
    kitchens: Yup.number(),
    parkingSpaces: Yup.number(),
    Price: Yup.string().required("Price is required"),
  });

  const propertyMediaValidationSchema = Yup.object().shape({
    photos: Yup.array().of(
      Yup.object().shape({
        path: Yup.string().required("Photo path is required"),
      })
    ),
    virtualTour: Yup.string().url("Invalid URL format"),
    video: Yup.string().url("Invalid URL format"),
  });

  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return basicInformationValidationSchema;
      case 1:
        return propertyDetailsValidationSchema;
      case 2:
        return propertyMediaValidationSchema;
      default:
        return Yup.object();
    }
  };

  const handleNextBtn = async () => {
    try {
      setLoading(true);
      const errors = await formik.validateForm();
      formik.setTouched({
        ...formik.touched,
        ...Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      });

      const stepErrors = Object.keys(errors).filter(
        (key) => formik.touched[key] && formik.errors[key]
      );

      if (stepErrors.length > 0) {
        setLoading(false);
        return;
      }

      if (activeStep === steps.length - 1) {
        formik.handleSubmit();
      } else {
        setCompletedSteps((prev) => prev + 1);
        setActiveStep((prevStep) => prevStep + 1);
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async (url, setter) => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Successfully fetched data from ${url}: `, res);
      const data = res.data;
      console.log("Data: ", data);
      setter(data);
    } catch (err) {
      console.log(`Issue fetching data from ${url}`);
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
      photos: [],
      virtualTour: "",
      video: "",
    },
    validationSchema: getValidationSchema(activeStep),

    onSubmit: async (values, helpers) => {
      const propertyListingData = {
        title: values.propertyTitle,
        listingType: values.propertyListingType,
        usageType: values.propertyUsageType,
        propertyType: values.propertyType,
        propertySubType: values.propertySubType,
        propertyCondition: values.propertyCondition,
        state: values.state,
        localGovernment: values.lga,
        neighbourhood: values.neighbourhood,
        size: values.size,
        propertyDetails: values.propertyDescription,
        NoOfLivingRooms: values.livingRooms,
        NoOfBedRooms: values.bedrooms,
        NoOfKitchens: values.kitchens,
        NoOfParkingSpace: values.parkingSpaces,
        Price: values.Price,
        virtualTour: values.virtualTour,
        video: values.video,
        photo: values.photos.map((photo) => ({ path: photo.path })),
      };

      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      const propertyListingConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/propertyListing/createPropertyListing`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: propertyListingData,
        withCredentials: true,
      };

      try {
        console.log("property listing data: ", propertyListingData);
        const res = await axios(propertyListingConfig);
        console.log("Successfully listed new property: ", res);
        onUserCreated();
        if (res.statusText === "OK") {
          helpers.setStatus({ success: true });
          formik.resetForm();
        }
      } catch (error) {
        console.error("Validation error:", error);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: error.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const CreateListingFormContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInformation
            formik={formik}
            propertyTypes={propertyTypes}
            listingTypes={listingTypes}
            propertyUsageTypes={propertyUsageTypes}
            propertyConditions={propertyConditions}
            states={states}
            localGovernment={localGovernment}
          />
        );

      case 1:
        return <PropertyDetails formik={formik} />;

      case 2:
        return <PropertyMedia formik={formik} />;

      default:
        return <div>404: Not Found</div>;
    }
  };

  return (
    <>
      <Head>
        <title>Create New Listing | Decatron Dashboard</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <LinearProgress
              variant="determinate"
              value={(activeStep / (steps.length - 1)) * 100}
              sx={{ mb: 2 }}
            />
            <Typography variant="h4">Create a new property listing</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {CreateListingFormContent(activeStep)}
                <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: "center" }}>
                  {activeStep > 0 && (
                    <Button variant="outlined" color="secondary" onClick={handleBackBtn}>
                      Back
                    </Button>
                  )}
                  <Box sx={{ flexGrow: 1 }} />
                  <Button variant="contained" color="primary" onClick={handleNextBtn}>
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CreateListing.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateListing;
