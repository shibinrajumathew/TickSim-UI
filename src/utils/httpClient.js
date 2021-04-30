import axios from "axios";
import config from "../config";

const {
  ms: { httpProtocol, baseUrl },
} = config;

const baseURL = httpProtocol + baseUrl;

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
