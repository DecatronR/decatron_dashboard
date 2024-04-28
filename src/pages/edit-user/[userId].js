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
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from 'next/router';
import { CreateUserDB } from 'src/components/database/create-user';

const EditUser = () => {
  const router = useRouter();
  const userId = router.query.userId;
  console.log("User Id:", userId);


  const userData = useLiveQuery(async () => {
    if (userId) {
      try {
        const user = await CreateUserDB.userDetails.get(userId);
        console.log("Found user data: ", user);
        return
      } catch (err) {
        console.log("There was an issue fethcing the data from teh database: ", err);
      }
      
    } else {
      console.log("Could not get user Id");
      return null;
    }
  });

  if (!userData) {
    return <div>Loading...</div>;
  } else {
    console.log("User data: ", userData);
  }

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
            src={userData.avatar}
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
            {userData.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {userData.email}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {userData.role}
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

export default EditUser;
