import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StatesTable } from "src/sections/state/states-table";
import { StatesSearch } from "src/sections/state/states-search";
import { applyPagination } from "src/utils/apply-pagination";
import CreateStatesForm from "src/sections/state/create-states-form";

const useStates = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useStatesIds = (states) => {
  return useMemo(() => {
    return states.map((state) => state.id);
  }, [states]);
};

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [statesData, setStatesData] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const states = useStates(statesData, page, rowsPerPage);
  const statesIds = useStatesIds(states);
  const statesSelection = useSelection(statesIds);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const fetchStates = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/state/fetchState`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("States data: ", response.data);
      setStatesData(response.data);
      setFilteredStates(response.data);
    } catch (err) {
      console.error("Error fetching states: ", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleStateFetched = () => {
    fetchStates();
    setIsFormOpen(false);
  };

  const handleSearch = (filteredStates) => {
    setFilteredStates(filteredStates);
  };

  return (
    <>
      <Head>
        <title>States</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">States</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    !isFormOpen ? (
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    ) : (
                      <SvgIcon fontSize="small">
                        <XMarkIcon />
                      </SvgIcon>
                    )
                  }
                  variant="contained"
                  onClick={handleToggleForm}
                >
                  {!isFormOpen ? "Create State" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateStatesForm onStateCreated={handleStateFetched} />}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <StatesSearch states={states} onSearch={handleSearch} />
            <StatesTable
              count={filteredStates.length}
              items={filteredStates}
              onRefresh={handleStateFetched}
              onDeselectAll={statesSelection.handleDeselectAll}
              onDeselectOne={statesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={statesSelection.handleSelectAll}
              onSelectOne={statesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={statesSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
