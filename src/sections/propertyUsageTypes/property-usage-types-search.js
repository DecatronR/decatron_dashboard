import { useState, useEffect } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const PropertyUsageTypesSearch = (props) => {
  const {propertyUsageTypes, onSearch} = props;
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredPropertyUsageTypes = propertyUsageTypes.filter(propertyUsageTypes =>
      propertyUsageTypes.propertyUsageType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    onSearch(filteredPropertyUsageTypes);
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
      placeholder="Search property usage types"
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
}
  

