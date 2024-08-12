import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import EditPropertyConditions from './edit-property-conditions';

export const PropertyConditionsTable = (props) => {
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

  const [editingPropertyCondition, setEditingPropertyCondition] = useState(null);
  const [existingData, setExistingData] = useState(null);

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const serialNumber = (index) => {
    return page * rowsPerPage + index + 1;
  };

  const handleEditClick = async (propertyConditionId) => {
    console.log("fetched property condition id: ", propertyConditionId);
    setEditingPropertyCondition(propertyConditionId);
    try {
      const res = await axios.post('http://localhost:8080/propertyCondition/editPropertyCondition', { id: propertyConditionId }, { withCredentials: true });
      console.log("Exisiting data: ", res.data.data.propertyCondition);
      setExistingData(res.data.data.propertyCondition);
    } catch (error) {
      console.error('Error fetching property conditions data:', error);
    }
  };

  const handleCancel = () => {
    setEditingPropertyCondition(null);
    setExistingData(null);
  };

  const handleSave = async (updatedPropertyConditon) => {
    console.log("Condition id: ", editingPropertyCondition);
    try {
      const res = await axios.post('http://localhost:8080/propertyCondition/updatePropertyCondition', { id: editingPropertyCondition, propertyCondition: updatedPropertyConditon}, { withCredentials: true });
      console.log("Updated property type: ", res.data);
      setEditingPropertyCondition(null);
      setExistingData(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteClick = async (propertyConditionId) => {
    try {
      const res = await axios.post('http://localhost:8080/propertyCondition/deletePropertyCondition', { id: propertyConditionId }, { withCredentials: true });
      console.log('Delete propertyCondition:', res);
      onRefresh();
    } catch (err) {
      console.error('Error deleting propertyCondition:', err);
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
              {items.map((propertyCondition, index) => {
                const isItemSelected = selected.indexOf(propertyCondition.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    key={propertyCondition._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(propertyCondition._id);
                          } else {
                            onDeselectOne?.(propertyCondition._id);
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
                        <Avatar src={propertyCondition.avatar}>
                          {getInitials(propertyCondition.propertyCondition)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {propertyCondition.propertyCondition}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {/* the user id is initialized with an underscore exactly this way at the backend */}
                      <IconButton onClick={() => handleEditClick(propertyCondition._id)}>
                        <SvgIcon fontSize="small">
                          <PencilIcon />
                        </SvgIcon>
                      </IconButton>
                      {editingPropertyCondition === propertyCondition._id && existingData && (
                        <EditPropertyConditions
                          initialData={existingData}
                          onSave={handleSave}
                          onCancel={handleCancel}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                     {/* the user id is initialized with an underscore exactly this way at the backend */}
                     <IconButton onClick={() => handleDeleteClick(propertyCondition._id)}>
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

PropertyConditionsTable.propTypes = {
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
  selected: PropTypes.array
};

export default PropertyConditionsTable;
