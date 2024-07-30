import { useState, useEffect } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const StatesSearch = (props) => {
  const {states, onSearch} = props;
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredStates = states.filter(states =>
      states.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
    onSearch(filteredStates);
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
        placeholder="Search states"
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
 
