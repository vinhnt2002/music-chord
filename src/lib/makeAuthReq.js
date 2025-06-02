import axios from "axios";
// import config from "@/data/config";

async function makeAuthReq({ url, method = "GET", body = {}, auth }) {
  const currentUser = auth.currentUser;
  const token = await currentUser.getIdToken();

  // Set up the request headers with the token
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method: method?.toUpperCase() ?? "GET",
    headers,
    data: body,
    url: url,
  };

  const response = await axios(options);
  return response;
}

export default makeAuthReq;
