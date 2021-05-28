import Axios from "axios";
import Config from "./config";

const { API_URL } = Config;

export const testGet = (params) =>
  Axios.post(`${API_URL}/testGet`, params).then((res) => res.data);

export const testPost = (params) =>
  Axios.get(`${API_URL}/testPost`, { params }).then((res) => res.data);
