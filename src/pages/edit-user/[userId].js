import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EditUserProfile } from "src/sections/users/edit-user-profile";
import { EditUserProfileDetails } from "src/sections/users/edit-user-profile-details";

const EditUser = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const userId = router.query.userId;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await axios.post(
            `${baseUrl}/users/editUsers`,
            { id: userId },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserData(res.data.data);
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };
      fetchUser();
    }
  }, [userId]);

  const handleProfileChange = (updatedData) => {
    setUserData(updatedData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      await axios.post(`${baseUrl}/users/update`, userData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/users");
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Edit User | Decatron Dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Edit User</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <EditUserProfile user={userData} />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <EditUserProfileDetails
                    user={userData}
                    onProfileChange={handleProfileChange}
                    onSubmit={handleSubmit}
                  />
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

EditUser.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditUser;
