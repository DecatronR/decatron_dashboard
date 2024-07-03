import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import PlusCircleIcon from '@heroicons/react/24/solid/PlusCircleIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import WrenchIcon from '@heroicons/react/24/solid/WrenchIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'User Management',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    subItems: [
      {
        title: 'Users',
        path: '/users',
      },
      {
        title: 'Add Role',
        path: '/',
      },
    ]
  },
  {
    title: 'Listing Configuration',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <WrenchIcon />
      </SvgIcon>
    ),
    subItems: [
      {
        title: 'Listing Type',
        path: '/',
      },
      {
        title: 'Property Type',
        path: '/',
      },
      {
        title: 'Add State',
        path: '/',
      },
      {
        title: 'Add LGA',
        path: '/',
      },
    ]
  },
  {
    title: 'Create Listing',
    path: '/create-listing',
    icon: (
      <SvgIcon fontSize="small">
        <PlusCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Favorites',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Saved Searches',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'My Profile',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
];
