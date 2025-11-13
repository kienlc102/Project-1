import { data } from "react-router-dom";
import axios from "./axiosCustomize";

const getCheckinAll = (userId, time) => {

  return axios.get("/api/checkins", );
}

const getCheckinByUser = (userId) => {
  return axios.get(`/api/checkins/${userId}`);
}

export { getCheckinAll, getCheckinByUser };