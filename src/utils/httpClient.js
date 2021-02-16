import axios from "axios";

// const baseURL = "http://localhost:3001";
const {
  location: { hostname },
} = window;

const baseURL = "http://" + hostname + ":3001";

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
