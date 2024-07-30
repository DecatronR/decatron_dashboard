import { useState, useEffect } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const RolesSearch = (props) => {
  const {roles, onSearch} = props;
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredRoles = roles.filter(roles =>
      roles.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    onSearch(filteredRoles);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        placeholder="Search roles"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
      />
    </Card>
  );
};
