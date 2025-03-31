import axios from "axios";
const step2_api = axios.create(
    {
        baseURL: "http://127.0.0.1:6006/", //这里配置的是后端服务提供的接口
        timeout: 1000000
    }
);
export default step2_api;
