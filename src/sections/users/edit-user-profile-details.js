import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const EditUserProfileDetails = ({ user, onProfileChange, onSubmit }) => {
  const [values, setValues] = useState(user);

  useEffect(() => {
    setValues(user);
  }, [user]);

  const handleChange = useCallback(
    (event) => {
      const newValues = {
        ...values,
        [event.target.name]: event.target.value
      };
      setValues(newValues);
      onProfileChange(newValues);
    },
    [values, onProfileChange]
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={onSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name || ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email || ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  value={values.phone || ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  value={values.role || ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
          >
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
