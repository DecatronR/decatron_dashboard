import Head from 'next/head';
import { useState } from 'react';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import BasicInformation from 'src/sections/createListingForm/basic-information';
import PropertyDetails from 'src/sections/createListingForm/property-details';
import PropertyMedia from 'src/sections/createListingForm/property-media';
import AdditionalInformation from 'src/sections/createListingForm/additional-information';
import { legalDocuments } from 'src/components/database/create-listing';

const steps = ['Basic Information', 'Property Details', ]
const CreateListing = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);

  const handleBackBtn = () => {
    setActiveStep((prevStep)=> prevStep - 1 );
  }

  const handleNextBtn = async () => {
    if (activeStep === steps.length - 1) {
      console.log('Ready for submission');
      // call backend function for submission
    } else {
        try {
            console.log("Going to the next step")
            await formik.validateForm();
            setCompletedSteps((prev) => prev + 1);
            setActiveStep((prevStep) => prevStep + 1);
        } catch (error) {
            console.error('Validation error:', error);
        }
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

  }), 
  onSubmit: (values) => {

  }
});

const CreateListingFormContent = (step) => {
  switch(step) {
    case 0:
      return <BasicInformation formik={formik} />;
    case 1:
      return <PropertyDetails formik={formik} />;
    case 2:
      return <PropertyMedia formik={formik} />
    default:
      return <div>404: Not Found</div>
  }  
}


  return (
    <>
      <Head>
        <title>
          Create New Listing | Decatron Dashboard
        </title>
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
                  <BasicInformation  formik={formik} />
                  <PropertyDetails formik={formik} />
                  <PropertyMedia formik={formik} />
                </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
);
}
  

CreateListing.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CreateListing;