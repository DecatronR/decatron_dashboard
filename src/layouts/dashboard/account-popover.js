import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuthContext } from 'src/contexts/auth-context';
import { useAuth } from 'src/hooks/use-auth';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const { user } = useAuthContext(); 
  const auth = useAuth();
  

  const handleSignOut = useCallback(() => {
      onClose?.();
      auth.signOut();
      router.push('/auth/login');
    },[onClose, auth, router]
  );

  const handleSignIn = useCallback(() => {
      onClose?.();
      router.push('/auth/login');
  },[onClose, router]);

  const capitalizeRole = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : '';
  };
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user?.name ? user.name : "You are not signed in"}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user?.role ?capitalizeRole(user.role) : "You are not signed in"}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        { auth.user ?  (
          <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem> 
        ) : (
          <MenuItem onClick={handleSignIn}>
          Sign in
          </MenuItem>
        )}
       
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
