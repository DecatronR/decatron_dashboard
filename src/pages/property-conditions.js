import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PropertyConditionsTable from 'src/sections/propertyConditions/property-conditions-table';
import { PropertyConditionsSearch } from 'src/sections/propertyConditions/property-conditions-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreatePropertyConditionsForm from 'src/sections/propertyConditions/create-property-conditions';

const usePropertyConditions = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const usePropertyConditionsIds = (propertyConditions) => {
  return useMemo(
    () => {
      return propertyConditions.map((propertyCondition) => propertyCondition.id);
    },
    [propertyConditions]
  );
};

const Page = () => {
  const [propertyConditionsData, setPropertyConditionsData] = useState([]);
  const [filteredPropertyConditions, setFilteredPropertyConditions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const propertyConditions = usePropertyConditions(propertyConditionsData, page, rowsPerPage);
  const propertyConditionsIds = usePropertyConditionsIds(propertyConditions);
  const propertyConditionsSelection = useSelection(propertyConditionsIds);
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

  const fetchPropertyConditions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/propertyType/fetchPropertyType', { withCredentials: true });
      console.log("Property conditions data: ",response.data);
      setPropertyConditionsData(response.data);
      setFilteredPropertyConditions(response.data);
    } catch (err) {
      console.error("Error fetching property conditions : ", err);
    }
  };


  useEffect(() => {
    fetchPropertyConditions();
  }, []);

  const handlePropertyConditionsFetched = () => {
    fetchPropertyTypes();
    setIsFormOpen(false);
  }

  const handleSearch = (filteredPropertyTypes) => {
    setFilteredPropertyConditions(filteredPropertyConditions);
  };

  return (
    <>
      <Head>
        <title>
          Property Conditions
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
                  Property Conditions
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
                  {!isFormOpen ? "Create Property Conditions" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreatePropertyConditionsForm onPropertyConditionsCreated={handlePropertyConditionsFetched} />}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <PropertyConditionsSearch propertyConditions={propertyConditionsData} onSearch={handleSearch} />
            <PropertyConditionsTable
              count={filteredPropertyConditions.length}
              items={filteredPropertyConditions}
              onRefresh={handlePropertyConditionsFetched}
              onDeselectAll={propertyConditionsSelection.handleDeselectAll}
              onDeselectOne={propertyConditionsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={propertyConditionsSelection.handleSelectAll}
              onSelectOne={propertyConditionsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={propertyConditionsSelection.selected}
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