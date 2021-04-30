import axios from "axios";

// const baseURL = "http://localhost:3001";
const { HTTP_PROTOCOL, MS_BASE_URL } = process.env;
const {
  location: { hostname },
} = window;

const baseURL = HTTP_PROTOCOL + MS_BASE_URL || "http://" + hostname + ":3001";

const instance = axios.create({
  baseURL,
});
export default {
  get: instance.get,
  post: instance.post,
  put: instance.put,
  patch: instance.patch,
  delete: instance.delete,
};
