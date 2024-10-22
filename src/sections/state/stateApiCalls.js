import axios from "axios";

export const createState = async (stateName) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("Create state button clicked");
  const token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
    return;
  }
  const createStateConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseUrl}/state/createState`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      state: stateName,
    },
    withCredentials: true,
  };

  try {
    const res = await axios(createStateConfig);
    console.log("Successfully called create state Api: ", res);
    return res.data;
  } catch (err) {
    console.log("Issues with createState api call: ", err);
  }
};
