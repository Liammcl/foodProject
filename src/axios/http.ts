import axios from "axios";
const basePath = "http://open.ai.wys168.cn";
const http = axios.create({
  // 请求头配置 token
  headers: {
    "ai-code": "Wys@Test",
  },
  // 基础路径
  baseURL: basePath,
  // 请求连接超时设置
  timeout: 3000,
  // responseType: 'stream',
  // 表示跨域请求时是否需要使用凭证，开启后，后端服务器要设置允许开启
  // withCredentials: true,
});
// 创建请求拦截
http.interceptors.request.use(
  (config) => {
    // 设置请求头
    if (!config.headers["content-type"]) {
      // 如果没有设置请求头
      config.headers["content-type"] = "application/json"; // post 请求
    }
    return config;
  },
  (error) => {
    return Promise.reject("出错");
  }
);

// 创建响应拦截
http.interceptors.response.use(
  (res) => {
    const data = res.data;
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default http;
