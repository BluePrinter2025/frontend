import axios from "axios";
const api = axios.create(
  {
    baseURL: "http://127.0.0.1:5000/", //这里配置的是后端服务提供的接口
    timeout: 100000
  }
);
export default api;
