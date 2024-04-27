import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { UsersTable } from 'src/sections/users/users-table';
import { UsersSearch } from 'src/sections/users/users-search';
import { applyPagination } from 'src/utils/apply-pagination';
import CreateUserForm from 'src/sections/users/create-user-form';

const now = new Date();

const data = [
  {
    id: '5e887ac47eed253091be10cb',
    username: "carson",
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: 'carson.darrin@devias.io',
    name: 'Carson Darrin',
    role: 'buyer',
    phone: '304-428-3097'  
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    username: "fran",
    avatar: '/assets/avatars/avatar-fran-perez.png',
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: 'fran.perez@devias.io',
    name: 'Fran Perez',
    role: 'buyer',
    phone: '712-351-5711'
  },
  {
    id: '5e887b7602bdbc4dbb234b27',
    username: "jie",
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    createdAt: subDays(subHours(now, 4), 2).getTime(),
    email: 'jie.yan.song@devias.io',
    name: 'Jie Yan Song',
    role: 'agent',
    phone: '770-635-2682'
  },
  {
    id: '5e86809283e28b96d2d38537',
    username: "anika",
    avatar: '/assets/avatars/avatar-anika-visser.png',
    createdAt: subDays(subHours(now, 11), 2).getTime(),
    email: 'anika.visser@devias.io',
    name: 'Anika Visser',
    role: 'buyer',
    phone: '908-691-3242'
  },
  {
    id: '5e86805e2bafd54f66cc95c3',
    username: "miron",
    avatar: '/assets/avatars/avatar-miron-vitold.png',
    createdAt: subDays(subHours(now, 7), 3).getTime(),
    email: 'miron.vitold@devias.io',
    name: 'Miron Vitold',
    role: 'seller',
    phone: '972-333-4106'
  },
  {
    id: '5e887a1fbefd7938eea9c981',
    username: "penjani",
    avatar: '/assets/avatars/avatar-penjani-inyene.png',
    createdAt: subDays(subHours(now, 5), 4).getTime(),
    email: 'penjani.inyene@devias.io',
    name: 'Penjani Inyene',
    role: 'agent',
    phone: '858-602-3409'
  },
  {
    id: '5e887d0b3d090c1b8f162003',
    username: "omar",
    avatar: '/assets/avatars/avatar-omar-darboe.png',
    createdAt: subDays(subHours(now, 15), 4).getTime(),
    email: 'omar.darobe@devias.io',
    name: 'Omar Darobe',
    role: 'buyer',
    phone: '415-907-2647'
  },
  {
    id: '5e88792be2d4cfb4bf0971d9',
    username: "siegbert",
    avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
    createdAt: subDays(subHours(now, 2), 5).getTime(),
    email: 'siegbert.gottfried@devias.io',
    name: 'Siegbert Gottfried',
    role: 'seller',
    phone: '702-661-1654'
  },
  {
    id: '5e8877da9a65442b11551975',
    username: "iulia",
    avatar: '/assets/avatars/avatar-iulia-albu.png',
    createdAt: subDays(subHours(now, 8), 6).getTime(),
    email: 'iulia.albu@devias.io',
    name: 'Iulia Albu',
    role: 'agent',
    phone: '313-812-8947',
    
  },
  {
    id: '5e8680e60cba5019c5ca6fda',
    username: "nasimiyu",
    avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
    createdAt: subDays(subHours(now, 1), 9).getTime(),
    email: 'nasimiyu.danai@devias.io',
    name: 'Nasimiyu Danai',
    role: 'agent',
    phone: '801-301-7894',
  }
];

const useUsers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useUsersIds = (users) => {
  return useMemo(
    () => {
      return users.map((user) => user.id);
    },
    [users]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const users = useUsers(page, rowsPerPage);
  const usersIds = useUsersIds(users);
  const usersSelection = useSelection(usersIds);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
  }

  return (
    <>
      <Head>
        <title>
          Users
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Users
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={ !isFormOpen ? (
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  ) : (
                    <SvgIcon fontSize="small">
                        <XMarkIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={handleToggleForm}
                >
                  {!isFormOpen ? "Create User" : "Close"}
                </Button>
              </div>
            </Stack>
            {isFormOpen && <CreateUserForm />}
            <UsersSearch />
            <UsersTable
              count={data.length}
              items={users}
              onDeselectAll={usersSelection.handleDeselectAll}
              onDeselectOne={usersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={usersSelection.handleSelectAll}
              onSelectOne={usersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={usersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
