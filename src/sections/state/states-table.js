import React, { useState } from 'react';
import axios from 'axios';
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
import EditStates from './edit-states';

export const StatesTable = (props) => {
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
    selected = []
  } = props;

  const [editingState, setEditingState] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (stateId) => {
    console.log("fetched state id: ", stateId);
    setEditingState(stateId);
    try {
      const res = await axios.post('http://localhost:8080/state/editState', { id: stateId }, { withCredentials: true });
      console.log("Exisiting data: ", res.data.data.state);
      setExistingData(res.data.data.state);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  const handleCancel = () => {
    setEditingState(null);
    setExistingState(null);
  };

  const handleSave = async (updatedState) => {
    console.log("State id: ", editingState);
    try {
      const res = await axios.post('http://localhost:8080/state/updateState', { id: editingState, state: updatedState}, { withCredentials: true });
      console.log("Updated state:  ", res.data);
      setEditingState(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleDeleteClick = async (stateId) => {
    try {
      const res = await axios.post('http://localhost:8080/state/deleteState', { id: stateId }, { withCredentials: true });
      console.log('Delete state:', res);
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
                    key={state._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(state._id);
                          } else {
                            onDeselectOne?.(state._id);
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
                          {getInitials(state.state)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {state.state}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                    <IconButton onClick={() => handleEditClick(state._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingState === state._id && existingData && (
                        <EditStates
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
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
