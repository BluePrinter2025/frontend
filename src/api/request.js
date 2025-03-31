import axios from "axios";
const api = axios.create(
  {
    baseURL: "http://127.0.0.1:5001/", //这里配置的是后端服务提供的接口
    timeout: 1000000
  }
);
const step2_api = axios.create(
  {
    baseURL: "http://127.0.0.1:5000/", //这里配置的是后端服务提供的接口
    timeout: 1000000
  }
);
export default api;
export default step2_api;
