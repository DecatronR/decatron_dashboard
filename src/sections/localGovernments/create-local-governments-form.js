import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Stack, TextField, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const CreateLocalGovernmentsForm = ({ onLocalGovernmentCreated }) => {
  const [states, setStates] = useState([]);

  const formik = useFormik({
    initialValues: {
      localGovernment: '',
      state: '',
      stateId: '',
      submit: null
    },
    validationSchema: Yup.object({
      localGovernment: Yup
        .string()
        .max(255)
        .required("field can't be empty"),
      state: Yup
        .string()
        .required("Please select a state"),
    }),

    onSubmit: async (values, helpers) => {
      console.log("Create button clicked");
      const localGovernmentData = {
        stateId: values.stateId,
        lga: values.localGovernment
      };
      const createLocalGovernmentConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/lga/createLGA',
        headers: {},
        data: localGovernmentData,
        withCredentials: true,
      };

      try {
        const res = await axios(createLocalGovernmentConfig);
        console.log("Successfully created new LGA: ", res);
        onLocalGovernmentCreated();
        helpers.setStatus({ success: true });
      } catch (err) {
        console.log("Issue creating new LGA: ", err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleFetchStates = async () => {
    const fetchStatesConfig = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/state/fetchState',
      headers: {},
      withCredentials: true,
    };

    try {
      const res = await axios(fetchStatesConfig);
      console.log("Successfully fetched states: ", res);
      const states = res.data;
      console.log("States: ", states);
      setStates(states);
    } catch (err) {
      console.log("Issue fetching states: ", err);
    }
  };

  useEffect(() => {
    handleFetchStates();
  }, []);

  const handleStateChange = (event) => {
    const selectedState = states.find(state => state._id === event.target.value);
    formik.setFieldValue('state', selectedState.state);
    formik.setFieldValue('stateId', selectedState._id);
  };

  return (
    <>
      <Head>
        <title>Create New LGA</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Create New LGA</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.localGovernment && formik.errors.localGovernment)}
                  fullWidth
                  helperText={formik.touched.localGovernment && formik.errors.localGovernment}
                  label="Local Government"
                  name="localGovernment"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.localGovernment}
                />
                <Select
                  error={!!(formik.touched.state && formik.errors.state)}
                  fullWidth
                  helperText={formik.touched.state && formik.errors.state}
                  label="State"
                  name="state"
                  onBlur={formik.handleBlur}
                  onChange={handleStateChange}
                  value={formik.values.stateId}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                  Select State
                  </MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state._id} value={state._id}>
                      {state.state}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Create
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default CreateLocalGovernmentsForm;
