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
import PropertyUsageTypesTable from 'src/sections/propertyUsageTypes/property-usage-types-table';
import { PropertyUsageTypesSearch } from 'src/sections/propertyUsageTypes/property-usage-types-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreatePropertyUsageTypesForm from 'src/sections/propertyUsageTypes/create-property-usage-types';

const usePropertyUsageTypes = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const usePropertyUsageTypesIds = (propertyUsageTypes) => {
  return useMemo(
    () => {
      return propertyUsageTypes.map((propertyUsageType) => propertyUsageType.id);
    },
    [propertyUsageTypes]
  );
};

const Page = () => {

  const [propertyUsageTypesData, setPropertyUsageTypesData] = useState([]);
  const [filteredPropertyUsageTypes, setFilteredPropertyUsageTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const propertyUsageTypes = usePropertyUsageTypes(propertyUsageTypesData, page, rowsPerPage);
  const propertyUsageTypesIds = usePropertyUsageTypesIds(propertyUsageTypes);
  const propertyUsageTypesSelection = useSelection(propertyUsageTypesIds);
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

  const fetchPropertyUsageTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/propertyUsage/fetchPropertyUsage', { withCredentials: true });
      console.log("Property usage type data: ",response.data);
      setPropertyUsageTypesData(response.data);
      setFilteredPropertyUsageTypes(response.data);
    } catch (err) {
      console.error("Error fetching property type : ", err);
    }
  };


  useEffect(() => {
    fetchPropertyUsageTypes();
  }, []);

  const handlePropertyUsageTypesFetched = () => {
    fetchPropertyUsageTypes();
    setIsFormOpen(false);
  }

  const handleSearch = (filteredPropertyUsageTypes) => {
    setFilteredPropertyUsageTypes(filteredPropertyUsageTypes);
  };

  return (
    <>
      <Head>
        <title>
          Property Usage Types
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
                  Property Usage Types
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
                  {!isFormOpen ? "Create Property Type" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreatePropertyUsageTypesForm onPropertyUsageTypeCreated={handlePropertyUsageTypesFetched} />}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <PropertyUsageTypesSearch propertyUsageTypes={propertyUsageTypesData} onSearch={handleSearch} />
            <PropertyUsageTypesTable
              count={filteredPropertyUsageTypes.length}
              items={filteredPropertyUsageTypes}
              onRefresh={handlePropertyUsageTypesFetched}
              onDeselectAll={propertyUsageTypesSelection.handleDeselectAll}
              onDeselectOne={propertyUsageTypesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={propertyUsageTypesSelection.handleSelectAll}
              onSelectOne={propertyUsageTypesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={propertyUsageTypesSelection.selected}
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