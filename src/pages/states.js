import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { subDays, subHours } from 'date-fns';
import axios from 'axios';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { StatesTable } from 'src/sections/state/states-table';
import { StatesSearch } from 'src/sections/state/state-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateStatesForm from 'src/sections/state/create-states-form';

const useStates = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useStatesIds = (state) => {
  return useMemo(
    () => {
      return states.map((state) => state.id);
    },
    [state]
  );
};

const Page = () => {
  const router = useRouter();
  const [statesData, setStatesData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const states = useStates(statesData, page, rowsPerPage);
  const statesIds = useStatesIds(states);
  const statesSelection = useSelection(statesIds);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
  }

//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/users/getusers', { withCredentials: true });
//       console.log("User data: ",response.data);
//       setUsersData(response.data);
//     } catch (err) {
//       console.error("Error fetching users: ", err);
//     }
//   };


  // useEffect(() => {
  //   fetchRoles();
  // }, []);

  const handleStateFetched = () => {
    fetchStates();
    setIsFormOpen(false);
  }

  const handleEditState = async (stateId) => {
    router.push(`/edit-state/${stateId}`);
  };

  const handleDeleteState = async (stateId) => {
    try {
      console.log("State Id ready: ", stateId);
      const res = await axios.post('http://localhost:8080/users/delete', { id: userId }, { withCredentials: true });
      console.log("Delete states: ", res);
      fetchUsers();
    } catch(err) {
      console.error("Error deleting state: ", err);
    }
  };


  return (
    <>
      <Head>
        <title>
          States
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  States
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={ !isFormOpen ? (
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  ) : (
                    <SvgIcon fontSize="small">
                        <XMarkIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={handleToggleForm}
                >
                  {!isFormOpen ? "Create State" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateStatesForm />} 
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <StatesSearch />
            <StatesTable
              count={statesData.length}
              items={states}
              onEditState={handleEditState}
              onDeleteState={handleDeleteState}
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

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;