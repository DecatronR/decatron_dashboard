import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';

export const AccountProfile = (props) => {
  const { user } = props;

  const [values, setValues] = useState({
    name: '',
    email: '',
    role: '', 
    id: '',
    phone: '',
  });

  const avatar = '/assets/avatars/avatar-anika-visser.png';

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        id: user.id || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const capitalizeRole = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : '';
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {values.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {capitalizeRole(values.role)}  
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {values.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
