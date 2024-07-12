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
import { ListingTypesTable } from 'src/sections/listingTypes/listing-types-table';
import { ListingTypesSearch } from 'src/sections/listingTypes/listing-types-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateListingTypesForm from 'src/sections/listingTypes/create-listing-types-form';

const useListingTypes = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useListingTypesIds = (listingTypes) => {
  return useMemo(
    () => {
      return listingTypes.map((listingType) => listingType.id);
    },
    [listingTypes]
  );
};

const Page = () => {
  const router = useRouter();
  const [listingTypesData, setListingTypesData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const listingTypes = useListingTypes(listingTypesData, page, rowsPerPage);
  const listingTypesIds = useListingTypesIds(listingTypes);
  const listingTypesSelection = useSelection(listingTypesIds);
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

  const fetchListingTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/listingType/fetchListingType', { withCredentials: true });
      console.log("Listing data: ",response.data);
      setListingTypesData(response.data);
    } catch (err) {
      console.error("Error fetching listingTypes: ", err);
    }
  };


  useEffect(() => {
    fetchListingTypes();
  }, []);

  const handleListingTypeFetched = () => {
    fetchListingTypes();
    setIsFormOpen(false);
  }

  const handleEditListingType = async (listingTypeId) => {
    router.push(`/edit-user/${userId}`);
  };

  const handleDeleteListingType = async (listingTypeId) => {
    try {
      console.log("Listing Type Id ready: ", listingTypeId);
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
          Listing Types
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
                  Listing Types
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
                  {!isFormOpen ? "Create Listing Type" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateListingTypesForm onListingTypeCreated={handleListingTypeFetched}/>}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <ListingTypesSearch />
            <ListingTypesTable
              count={listingTypesData.length}
              items={listingTypes}
              onEditListingType={handleEditListingType}
              onDeleteListingType={handleDeleteListingType}
              onDeselectAll={listingTypesSelection.handleDeselectAll}
              onDeselectOne={listingTypesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={listingTypesSelection.handleSelectAll}
              onSelectOne={listingTypesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={listingTypesSelection.selected}
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