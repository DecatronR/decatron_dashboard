import React, { useState, useEffect } from "react";
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
import EditRoles from "./edit-roles";

export const RolesTable = (props) => {
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

  const [editingRole, setEditingRole] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (roleId) => {
    console.log("fetched role id: ", roleId);
    setEditingRole(roleId);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/role/editRole`,
        { roleId: roleId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Existing data: ", res.data.data.roleName);
      setExistingData(res.data.data.roleName);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  const handleCancel = () => {
    setEditingRole(null);
    setExistingData(null);
  };

  const handleSave = async (updatedRole) => {
    console.log("Role id: ", editingRole);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/role/updateRole`,
        { roleId: editingRole, roleName: updatedRole },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Updated role: ", res.data);
      setEditingRole(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteClick = async (roleId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/role/deleteRole`,
        { roleId: roleId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete role:", res);
      onRefresh();
    } catch (err) {
      console.error("Error deleting role:", err);
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
              {items.map((role, index) => {
                const isItemSelected = selected.indexOf(role.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={role.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(role.id);
                          } else {
                            onDeselectOne?.(role.id);
                          }
                        }}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell>{serialNumber(index)}</TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={role.avatar}>{getInitials(role.roleName)}</Avatar>
                        <Typography variant="subtitle2">{role.roleName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(role._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingRole === role._id && existingData && (
                        <EditRoles
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteClick(role._id)}>
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

RolesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onEditRole: PropTypes.func,
  onDeleteRole: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default RolesTable;
