import Head from 'next/head';
import { useState } from 'react';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Button, LinearProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import BasicInformation from 'src/sections/createListingForm/basic-information';
import PropertyDetails from 'src/sections/createListingForm/property-details';
import PropertyMedia from 'src/sections/createListingForm/property-media';
import { legalDocuments } from 'src/components/database/create-listing';

const steps = ['Basic Information', 'Property Details', 'Property Media'];
const CreateListing = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(0);

    const handleBackBtn = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleNextBtn = async () => {
      try {
          await formik.validateForm();
          if (activeStep === steps.length - 1) {
              formik.handleSubmit(); // Trigger form submission if last step
          } else {
              setCompletedSteps((prev) => prev + 1);
              setActiveStep((prevStep) => prevStep + 1);
          }
      } catch (error) {
          console.error('Validation error:', error);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
      }
  };
  

    const formik = useFormik({
        initialValues: {
            propertyTitle: '',
            propertyListingType: '',
            propertyUsageType: '',
            propertyType: '',
            propertySubType: '',
            state: '',
            neighbourhood: '',
            size: '',
            propertyCondition: '',
            livingRooms: '',
            bedrooms: '',
            bathrooms: '',
            kitchens: '',
            parkingSpaces: '',
            amenities: '',
            price: '',
            legalDocuments: '',
            photos: '',
            virtualTour: '',
            video: '',
        },
        validationSchema: Yup.object({
          propertyTitle: Yup
            .string()
            .required('Property title is required'),
          propertyListingType: Yup
            .string()
            .required('Property listing type is required'),
          propertyUsageType: Yup
            .string()
            .required('Property usage type is required'),
          propertyType: Yup
            .string()
            .required('Property type is required'),
          propertySubType: Yup
            .string(),
          state: Yup
            .string()
            .required('State is required'),
          neighbourhood: Yup
            .string()
            .required('Neighbourhood is required'),
          size: Yup
            .string(),
          propertyCondition: Yup
            .string(),
          livingRooms: Yup
            .number(),
          bedrooms: Yup
            .number(),
          bathrooms: Yup
            .number(),
          kitchens: Yup
            .number(),
          parkingSpaces: Yup
            .number(),
          price: Yup
            .number()
            .required('Price is required')
            .positive('Price must be positive'),
          legalDocuments: Yup
            .string(),
          photos:Yup
            .mixed()
            .required('Image is required')
            .test('fileType', 'Only JPEG, PNG, and JPG images are allowed', (value) => {
              if (!value) return false;
              return (
                value.type.startsWith('image/') &&
                ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
              );
            }),
          virtualTour: Yup.
            string()
            .url('Invalid URL format'),
          video: Yup
            .string()
            .url('Invalid URL format'),
        }),
        onSubmit: async (values, helpers) => {
          try {
          
        } catch (error) {
            console.error('Validation error:', error);
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
          }
        },
    });

    const CreateListingFormContent = (step) => {
        switch (step) {
            case 0:
                return <BasicInformation formik={formik} />;
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
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} />
                        <div>
                            <Typography variant="h4">
                                Create New Listing
                            </Typography>
                        </div>
                        <div>
                            <Grid
                                xs={12}
                                md={6}
                                lg={8}
                            >
                                {CreateListingFormContent(activeStep)}
                                <Stack 
                                  direction="row" 
                                  spacing={2}
                                  mt={2}
                                  justifyContent="space-between"
                                >
                                    <Button
                                      variant="contained"
                                      disabled={activeStep === 0}
                                      onClick={handleBackBtn}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={handleNextBtn}
                                  >
                                      {activeStep === steps.length - 1 ? "Submit" : "Save and Continue" }
                                    </Button>
                                </Stack>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

CreateListing.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default CreateListing;
