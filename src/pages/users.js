import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import axios from 'axios';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { UsersTable } from 'src/sections/users/users-table';
import { UsersSearch } from 'src/sections/users/users-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateUserForm from 'src/sections/users/create-user-form';

const useUsers = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useUsersIds = (users) => {
  return useMemo(
    () => {
      return users.map((user) => user.id);
    },
    [users]
  );
};

const Page = () => {
  const [usersData, setUsersData] = useState([]); // State for user data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const users = useUsers(usersData, page, rowsPerPage); // Use fetched data
  const usersIds = useUsersIds(users);
  const usersSelection = useSelection(usersIds);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/getusers', { withCredentials: true });
      console.log("User data: ",response.data);
      setUsersData(response.data);
    } catch (err) {
      console.error("Error fetching users: ", err);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserFetched = () => {
    fetchUsers();
    setIsFormOpen(false);
  }

  const handleEditUser = async (userId) => {
    if (onEditUser) {
      onEditUser(userId);
    } else {
      router.push(`/edit-user/${userId}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log("User Id ready: ", userId);
      const res = await axios.post('http://localhost:8080/users/delete', { id: userId }, { withCredentials: true });
      console.log("Delete users: ", res);
      fetchUsers();
    } catch(err) {
      console.error("Error deleting users: ", err);
    }
  };


  return (
    <>
      <Head>
        <title>
          Users
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
                  Users
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
                  {!isFormOpen ? "Create User" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateUserForm onUserCreated={handleUserFetched} />}
            <UsersSearch />
            <UsersTable
              count={usersData.length}
              items={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onDeselectAll={usersSelection.handleDeselectAll}
              onDeselectOne={usersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={usersSelection.handleSelectAll}
              onSelectOne={usersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={usersSelection.selected}
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