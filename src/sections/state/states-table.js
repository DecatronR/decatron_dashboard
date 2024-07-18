import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
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
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';

export const StatesTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    onEditState,
    onDeleteState,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const [editingRole, setEditingRole] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (stateId) => {
    console.log("fetched role id: ", stateId);
    setEditingRole(stateId);
    try {
      const res = await axios.post('http://localhost:8080/role/editRole', { roleId: roleId }, { withCredentials: true });
      console.log("Exisiting data: ", res.data.data.stateName);
      setExistingData(res.data.data.stateName);
    } catch (error) {
      console.error('Error fetching role data:', error);
    }
  };

  const handleCancel = () => {
    setEditingRole(null);
    setExistingData(null);
  };

  const handleSave = async (updatedRole) => {
    console.log("Role id: ", editingRole);
    try {
      const res = await axios.post('http://localhost:8080/role/updateRole', { roleId: editingRole, roleName: updatedRole}, { withCredentials: true });
      console.log("Updated role: ", res.data);
      setEditingRole(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteClick = async (roleId) => {
    try {
      const res = await axios.post('http://localhost:8080/role/deleteRole', { roleId: roleId }, { withCredentials: true });
      console.log('Delete role:', res);
      onRefresh();
    } catch (err) {
      console.error('Error deleting role:', err);
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
                <TableCell>
                  #
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Edit
                </TableCell>
                <TableCell>
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((state, index) => {
                const isItemSelected = selected.indexOf(state.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    key={state.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(state.id);
                          } else {
                            onDeselectOne?.(state.id);
                          }
                        }}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell>
                      {serialNumber(index)}
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={state.avatar}>
                          {getInitials(state.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {state.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      Edit
                    </TableCell>
                    <TableCell>
                      Delete
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleEditClick(state._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleDeleteClick(state._id)}>
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

StatesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onEditState: PropTypes.func,
  onDeleteState: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};

export default StatesTable;
