import axios from "axios";

const instance = axios.create({
  baseURL: "https://staging-api.takyon.io",
});

export default instance;
