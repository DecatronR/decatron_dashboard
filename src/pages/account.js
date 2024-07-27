import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, CircularProgress } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';

const Page = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
      if (userId) {
        try {
          const response = await axios.post('http://localhost:8080/users/editUsers', { id: userId }, { withCredentials: true });
          const user = response.data.data;
          setUser(user);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("User not logged in");
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>
          Account | Decatron Dashboard
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
                Account
              </Typography>
            </div>
            <div>
              {loading ? (
                <CircularProgress />
              ) : (
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={6}
                    lg={4}
                  >
                    <AccountProfile user={user} />
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                    lg={8}
                  >
                    <AccountProfileDetails user={user} />
                  </Grid>
                </Grid>
              )}
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
