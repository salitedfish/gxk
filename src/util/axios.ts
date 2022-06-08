import { Method, PromiseWithVoid, ResponseType, ObjectReadonlyType, ObjectType } from "../type";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

export const useAxios = (baseURL: string = "/", timeout: number = 10000, headerConfig: ObjectReadonlyType<string | number> = {}) => {
  const baseAxios: AxiosInstance = axios.create({
    baseURL,
    timeout,
  });
  baseAxios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers) {
      return { ...config.headers, ...headerConfig };
    }
  });
  baseAxios.interceptors.response.use(
    (res: AxiosResponse) => {
      const ret = res.data as any;
      if (ret.code == 200) {
        return ret;
      } else {
        return Promise.reject(ret.msg);
      }
    },
    (err: any) => {
      return Promise.reject(err.response ? (err.response.data ? err.response.data.msg : err.response.statusText) : "网络异常~");
    }
  );
  const CancelToken = axios.CancelToken;

  const service = async (
    method: Method,
    url: string,
    params: ObjectReadonlyType<string | number> = {},
    data: ObjectReadonlyType = {},
    config: ObjectReadonlyType<string | number> = {},
    cancelSourceArray?: any[]
  ): PromiseWithVoid<ResponseType> => {
    /**如果有传递过来收集取消器的数组，那就收集取消器，一般用不到 */
    let resConfig: ObjectType = { ...config, params };
    if (cancelSourceArray) {
      const source: {
        token: any;
        cancel: (message: any) => void;
      } = CancelToken.source();
      cancelSourceArray.push(source);
      resConfig.CancelToken = source.token;
    }

    /**根据项目需求不同再写 */
    if (method === "GET") {
      return baseAxios
        .get(url, resConfig)
        .then((res: unknown) => {
          return res as ResponseType;
        })
        .catch((err: any) => {
          console.log(err || "网络异常~");
        });
    } else if (method === "POST") {
      return baseAxios
        .post(url, data, resConfig)
        .then((res: unknown) => {
          return res as ResponseType;
        })
        .catch((err: any) => {
          console.log(err || "网络异常~");
        });
    } else if (method === "DELETE") {
      return baseAxios
        .delete(url, resConfig)
        .then((res: unknown) => {
          return res as ResponseType;
        })
        .catch((err: any) => {
          console.log(err || "网络异常~");
        });
    } else if (method === "PUT") {
      return baseAxios
        .put(url, data, resConfig)
        .then((res: unknown) => {
          return res as ResponseType;
        })
        .catch((err: any) => {
          console.log(err || "网络异常~");
        });
    } else {
      console.log("请求方法错误");
    }
  };
  return service;
};