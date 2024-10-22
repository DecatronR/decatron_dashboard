import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import EditPropertyTypes from "./edit-property-types";

export const PropertyTypesTable = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    count = 0,
    items = [],
    onRefresh,
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [editingPropertyType, setEditingPropertyType] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (propertyTypeId) => {
    console.log("fetched property type id: ", propertyTypeId);
    setEditingPropertyType(propertyTypeId);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/propertyType/editPropertyType`,
        { id: propertyTypeId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Existing data: ", res.data.data.propertyType);
      setExistingData(res.data.data.propertyType);
    } catch (error) {
      console.error("Error fetching property type data:", error);
    }
  };

  const handleCancel = () => {
    setEditingPropertyType(null);
    setExistingData(null);
  };

  const handleSave = async (updatedPropertyType) => {
    console.log("Role id: ", editingPropertyType);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/propertyType/updatePropertyType`,
        { id: editingPropertyType, propertyType: updatedPropertyType },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated property type: ", res.data);
      setEditingPropertyType(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteClick = async (propertyTypeId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/propertyType/deletePropertyType`,
        { id: propertyTypeId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete propertyType:", res);
      onRefresh();
    } catch (err) {
      console.error("Error deleting propertyType:", err);
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((propertyType, index) => {
                const isItemSelected = selected.indexOf(propertyType.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={propertyType.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(propertyType.id);
                          } else {
                            onDeselectOne?.(propertyType.id);
                          }
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell>{serialNumber(index)}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={propertyType.avatar}>
                          {getInitials(propertyType.propertyType)}
                        </Avatar>
                        <Typography variant="subtitle2">{propertyType.propertyType}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleEditClick(propertyType._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingPropertyType === propertyType._id && existingData && (
                        <EditPropertyTypes
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleDeleteClick(propertyType._id)}>
                        <SvgIcon fontSize="small">
                          <TrashIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PropertyTypesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onEditPropertyType: PropTypes.func,
  onDeletePropertyType: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default PropertyTypesTable;
