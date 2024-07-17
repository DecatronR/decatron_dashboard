import axios from "axios";

export const createState = async (stateName) => {
    console.log("Create state button clicked");
    const createStateConfig = {
      method: 'post',
      maxBodyLength: Infinity,
        url: 'http://localhost:8080/state/createState',
        headers: { },
        data : {
          state: stateName,
        },
      withCredentials: true,
    }

    try {
        const res = await axios(createStateConfig);
        console.log("Successfully called create state Api: ", res);
        return res.data;
    } catch (err) {
        console.log("Issues with createState api call: ", err);
    }
}