import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
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
import EditLocalGovernments from "./edit-local-governments";

export const LocalGovernmentsTable = (props) => {
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

  const [editingLocalGovernment, setEditingLocalGovernment] = useState(null);
  const [editingState, setEditingStateId] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (lgaId, stateId) => {
    console.log("fetched lga id: ", lgaId);
    setEditingLocalGovernment(lgaId);
    setEditingStateId(stateId);
    try {
      const res = await axios.post(
        `${baseUrl}/lga/editLGA`,
        { id: lgaId },
        { withCredentials: true }
      );
      console.log("Existing data: ", res.data.data.lga);
      setExistingData(res.data.data.lga);
    } catch (error) {
      console.error("Error fetching localGovernment data:", error);
    }
  };

  const handleCancel = () => {
    setEditingLocalGovernment(null);
    setExistingData(null);
  };

  const handleSave = async (updatedLga) => {
    console.log("Local government id: ", editingLocalGovernment);
    try {
      const res = await axios.post(
        `${baseUrl}/lga/updateLGA`,
        { id: editingLocalGovernment, lga: updatedLga, stateId: editingState },
        { withCredentials: true }
      );
      console.log("Updated role: ", res.data);
      setEditingLocalGovernment(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteClick = async (lgaId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/lga/deleteLGA`,
        { id: lgaId },
        { withCredentials: true }
      );
      console.log("Delete local government:", res);
      onRefresh();
    } catch (err) {
      console.error("Error deleting local goverment:", err);
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
              {items.map((localGovernment, index) => {
                const isItemSelected = selected.indexOf(localGovernment.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={localGovernment.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(localGovernment.id);
                          } else {
                            onDeselectOne?.(localGovernment.id);
                          }
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell>{serialNumber(index)}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={localGovernment.avatar}>
                          {getInitials(localGovernment.lga)}
                        </Avatar>
                        <Typography variant="subtitle2">{localGovernment.lga}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton
                        onClick={() =>
                          handleEditClick(localGovernment._id, localGovernment.stateId)
                        }
                      >
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingLocalGovernment === localGovernment._id && existingData && (
                        <EditLocalGovernments
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleDeleteClick(localGovernment._id)}>
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

LocalGovernmentsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onEditLocalGovernment: PropTypes.func,
  onDeleteLocalGovernment: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default LocalGovernmentsTable;
