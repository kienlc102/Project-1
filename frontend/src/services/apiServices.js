import { data } from "react-router-dom";
import axios from "./axiosCustomize";

const getCheckinAll = () => {

  return axios.get("/api/checkins", );
}

const getCheckinByUser = (userId) => {
  return axios.get(`/api/checkins/${userId}`);
}

const getCheckoutAll = () => {
  return axios.get("/api/checkouts", );
}

const getCheckoutByUser = (userId) => {
  return axios.get(`/api/checkouts/${userId}`);
}

export { getCheckinAll, getCheckinByUser, getCheckoutAll, getCheckoutByUser };