import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
} from "@mui/material";

export const AccountProfileDetails = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = props;

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    id: "",
    phone: "",
  });
  const [rolesData, setRolesData] = useState([]);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValues({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        role: user.role || "",
        id: user.id || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const capitalizeRole = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";
  };

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      try {
        const response = await axios.get(`${baseUrl}/role/getRoles`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("roles: ", response.data);
        setRolesData(response.data);
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }
      const updatedUser = {
        ...values,
        name: `${values.firstName} ${values.lastName}`,
        role: values.role.toLowerCase(),
      };

      try {
        console.log("Updating user:", updatedUser);
        await axios.post(`${baseUrl}/users/update`, updatedUser, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Error updating user:", err);
      }
    },
    [values]
  );

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Select
                  fullWidth
                  label="Role"
                  name="role"
                  onChange={handleChange}
                  value={values.role}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Role
                  </MenuItem>
                  {rolesData.map((role) => (
                    <MenuItem key={role._id} value={role.slug}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
