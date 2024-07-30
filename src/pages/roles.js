import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { subDays, subHours } from 'date-fns';
import axios from 'axios';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { RolesTable } from 'src/sections/roles/roles-table';
import { RolesSearch } from 'src/sections/roles/roles-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateRoleForm from 'src/sections/roles/create-roles-form';

const useRoles = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useRolesIds = (roles) => {
  return useMemo(
    () => {
      return roles.map((role) => role.id);
    },
    [roles]
  );
};

const Page = () => {
  const [rolesData, setRolesData] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const roles = useRoles(rolesData, page, rowsPerPage);
  const rolesIds = useRolesIds(roles);
  const rolesSelection = useSelection(rolesIds);
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

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/role/getRoles', { withCredentials: true });
      console.log("User data: ",response.data);
      setRolesData(response.data);
      setFilteredRoles(response.data);
    } catch (err) {
      console.error("Error fetching users: ", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleFetched = () => {
    fetchRoles();
    setIsFormOpen(false);
  }

  const handleSearch = useCallback((filteredRoles) => {
    setFilteredRoles(filteredRoles);
  },[]);

  return (
    <>
      <Head>
        <title>
          Roles
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
                  Roles
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
                  {!isFormOpen ? "Create Role" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateRoleForm onRoleCreated={handleRoleFetched}/>}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <RolesSearch roles={rolesData} onSearch={handleSearch}/>
            <RolesTable
              count={filteredRoles.length}
              items={filteredRoles}
              onRefresh={handleRoleFetched}
              onDeselectAll={rolesSelection.handleDeselectAll}
              onDeselectOne={rolesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={rolesSelection.handleSelectAll}
              onSelectOne={rolesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={rolesSelection.selected}
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