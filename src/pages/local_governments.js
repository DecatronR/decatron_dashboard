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
import { LocalGovernmentsTable } from 'src/sections/localGovernments/local-governments-table';
import { LocalGovernmentsSearch } from 'src/sections/localGovernments/local-governments-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateLocalGovernmentsForm from 'src/sections/localGovernments/create-local-governments-form';

const useLocalGovernmenmts = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useLocalGovernmentsIds = (localGovernments) => {
  return useMemo(
    () => {
      return localGovernments.map((localGovernment) => localGovernment.id);
    },
    [localGovernments]
  );
};

const Page = () => {
  const router = useRouter();
  const [localGovernmentsData, setLocalGovernmentsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const localGovernments = useLocalGovernmenmts(localGovernmentsData, page, rowsPerPage);
  const localGovernmentsIds = useLocalGovernmentsIds(localGovernments);
  const localGovernmentsSelection = useSelection(localGovernmentsIds);
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

  const handleLocalGovernmentsFetched = () => {
    fetchLocalGovernments();
    setIsFormOpen(false);
  }

  const handleEditLocalGovernment = async (localGovernmentId) => {
    router.push(`/edit-role/${localGovernmentIdId}`);
  };

  const handleDeleteLocalGovernment = async (userId) => {
    try {
      console.log("Local Government Id ready: ", roleId);
      const res = await axios.post('http://localhost:8080/users/delete', { id: userId }, { withCredentials: true });
      console.log("Delete local government: ", res);
      fetchLocalGovernments();
    } catch(err) {
      console.error("Error deleting local governments: ", err);
    }
  };

  return (
    <>
      <Head>
        <title>
          LGAs
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
                  LGAs
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
                  {!isFormOpen ? "Create LGAs" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateLocalGovernmentsForm onLocalGovernmentCreated={handleLocalGovernmentsFetched} />} 
            <LocalGovernmentsSearch />
            <LocalGovernmentsTable
              count={localGovernmentsData.length}
              items={localGovernments}
              onEditLocalGovernment={handleEditLocalGovernment}
              onDeleteLocalGovernment={handleDeleteLocalGovernment}
              onDeselectAll={localGovernmentsSelection.handleDeselectAll}
              onDeselectOne={localGovernmentsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={localGovernmentsSelection.handleSelectAll}
              onSelectOne={localGovernmentsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={localGovernmentsSelection.selected}
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