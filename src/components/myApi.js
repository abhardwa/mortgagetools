import axios from "axios";

// const url="https://abhardwa.pythonanywhere.com";
// const url="http://127.0.0.1:5000";

async function dbData(arg, type, userData) {
  // const url="https://abhardwa.pythonanywhere.com";
  //   const url = "http://127.0.0.1:5000";
  const url = process.env.REACT_APP_API_SERVER_URL;
  // console.log(url);
  try {
    if (type === "get") {
      const response = await axios.get(url + arg);
      // console.log(response.data);
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(response.headers);
      // console.log(response.config);
      return response.data;
    } else {
      const response = await axios.post(url + arg, userData);
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default dbData;
