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
import EditListingTypes from "./edit-listing-types";

export const ListingTypesTable = (props) => {
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

  const [editingListingType, setEditingListingType] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (listingTypeId) => {
    console.log("fetched listing type id: ", listingTypeId);
    setEditingListingType(listingTypeId);
    try {
      const res = await axios.post(
        `${baseUrl}/listingType/editListingType`,
        { id: listingTypeId },
        { withCredentials: true }
      );
      console.log("Existing data: ", res.data.data.listingType);
      setExistingData(res.data.data.listingType);
    } catch (error) {
      console.error("Error fetching property type data:", error);
    }
  };

  const handleCancel = () => {
    setEditingListingType(null);
    setExistingData(null);
  };

  const handleSave = async (updatedlistingType) => {
    console.log("Listing type id: ", editingListingType);
    try {
      const res = await axios.post(
        `${baseUrl}/listingType/updateListingType`,
        { id: editingListingType, listingType: updatedlistingType },
        { withCredentials: true }
      );
      console.log("Updated property type: ", res.data);
      setEditingListingType(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteClick = async (listingTypeId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/listingType/deletelistingType`,
        { id: listingTypeId },
        { withCredentials: true }
      );
      console.log("Delete listingType:", res);
      onRefresh();
    } catch (err) {
      console.error("Error deleting listingType:", err);
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
              {items.map((listingType, index) => {
                const isItemSelected = selected.indexOf(listingType.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={listingType.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(listingType.id);
                          } else {
                            onDeselectOne?.(listingType.id);
                          }
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell>{serialNumber(index)}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={listingType.avatar}>
                          {getInitials(listingType.listingType)}
                        </Avatar>
                        <Typography variant="subtitle2">{listingType.listingType}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(listingType._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingListingType === listingType._id && existingData && (
                        <EditListingTypes
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteClick(listingType._id)}>
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

ListingTypesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onEditListingType: PropTypes.func,
  onDeleteListingType: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default ListingTypesTable;
