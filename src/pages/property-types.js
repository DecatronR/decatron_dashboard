import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { subDays, subHours } from "date-fns";
import axios from "axios";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PropertyTypesTable } from "src/sections/propertyTypes/property-types-table";
import { PropertyTypesSearch } from "src/sections/propertyTypes/property-types-search";
import { applyPagination } from "src/utils/apply-pagination";
import CreatePropertyTypesForm from "src/sections/propertyTypes/create-property-types-form";

const usePropertyTypes = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const usePropertyTypesIds = (propertyTypes) => {
  return useMemo(() => {
    return propertyTypes.map((propertyType) => propertyType.id);
  }, [propertyTypes]);
};

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [propertyTypesData, setPropertyTypesData] = useState([]);
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const propertyTypes = usePropertyTypes(propertyTypesData, page, rowsPerPage);
  const propertyTypesIds = usePropertyTypesIds(propertyTypes);
  const propertyTypesSelection = useSelection(propertyTypesIds);
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

  const fetchPropertyTypes = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/propertyType/fetchPropertyType`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Property type data: ", response.data);
      setPropertyTypesData(response.data);
      setFilteredPropertyTypes(response.data);
    } catch (err) {
      console.error("Error fetching property type : ", err);
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const handlePropertyTypeFetched = () => {
    fetchPropertyTypes();
    setIsFormOpen(false);
  };

  const handleSearch = (filteredPropertyTypes) => {
    setFilteredPropertyTypes(filteredPropertyTypes);
  };

  return (
    <>
      <Head>
        <title>Property Types</title>
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
                <Typography variant="h4">Property Types</Typography>
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
                  {!isFormOpen ? "Create Property Type" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && (
              <CreatePropertyTypesForm onPropertyTypeCreated={handlePropertyTypeFetched} />
            )}
            {/* add the function to trigger submitonRoleCreated={handleRolesFetched}  */}
            <PropertyTypesSearch propertyTypes={propertyTypesData} onSearch={handleSearch} />
            <PropertyTypesTable
              count={filteredPropertyTypes.length}
              items={filteredPropertyTypes}
              onRefresh={handlePropertyTypeFetched}
              onDeselectAll={propertyTypesSelection.handleDeselectAll}
              onDeselectOne={propertyTypesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={propertyTypesSelection.handleSelectAll}
              onSelectOne={propertyTypesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={propertyTypesSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
