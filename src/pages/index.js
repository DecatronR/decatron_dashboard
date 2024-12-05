import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fromUnixTime, subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewUsers } from "src/sections/overview/overview-users";
import { OverviewPropertiesListed } from "src/sections/overview/overview-properties-listed";
import { OverviewInspectionsBooked } from "src/sections/overview/overview-inspections-booked";
import { OverviewInspectionsCompleted } from "src/sections/overview/overview-inspections-completed";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { OverviewMonthlyActiveUsers } from "src/sections/overview/overview-monthly-active-users";

const now = new Date();

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalProperties, setTotalProperties] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/users/getusers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalUsers(response.data.length);
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await axios.get(`${baseUrl}/propertyListing/fetchPropertyListing`, {
          withCredentials: true,
        });
        console.log("properties total: ", res.data);
        setTotalProperties(res.data.length);
      } catch (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {});

  return (
    <>
      <Head>
        <title>Overview | Decatron</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewUsers difference={12} positive sx={{ height: "100%" }} value={totalUsers} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewPropertiesListed
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value={totalProperties}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewInspectionsBooked
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="4"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewInspectionsCompleted sx={{ height: "100%" }} value="0" />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewMonthlyActiveUsers
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Desktop", "Tablet", "Phone"]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}></Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
