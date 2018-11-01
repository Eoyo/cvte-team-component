import Axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosTransformer,
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
} from "axios";
import { checki } from "./checkOperator";
import { app } from "../stores/app/app";
import { utilsLog } from "../services/native";

function CatchStatus<T>(res: AxiosResponse<T>): checki<any> {
  if (res.status >= 200 && res.status < 300) {
    return {
      ...checki(res.data),
      result: true,
      message: "success",
    };
  } else {
    return {
      ...checki(res.data),
      result: false,
      message: "fail",
    };
  }
  // switch (res.status) {
  //   case 200:
  //     return {
  //       ...checki(res.data),
  //       result: true,
  //       message: "成功 @200",
  //     };
  //   case 401:
  //     return {
  //       ...checki(res.data),
  //       message: "登录错误 @401",
  //     };
  //   case 404:
  //     return {
  //       ...checki(res.data),
  //       message: "路径错误 @404",
  //     };
  //   default:
  //     return {
  //       ...checki(res.data),
  //       message: "未分类错误 @" + res.status,
  //     };
  // }
}

interface AxiosData<T> {
  url?: string;
  method?: string;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: T;
  timeout?: number;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: (status: number) => boolean;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
}
/**
 *
 */
export function RestfulApi(p: AxiosRequestConfig) {
  const AxiosInstance = Axios.create({
    ...p,
    // baseURL: "http://localhost:9100",
  });
  // private functions;
  const me = {
    successHandler: CatchStatus,

    // 出错时可能没有response!!
    /*
    跨域时没有response, 断网也没有response
     */

    errorHandler(err: any): checki<any> {
      const { response } = err;
      if (!response || !response.status) {
        return {
          ...checki(err),
          message: "网络出错",
          code: "6-0000",
        };
      } else {
        return CatchStatus(response);
      }
    },
  };
  type methodType = "get" | "post" | "delete" | "patch" | "put";
  type SimpleMethod<P, T> = {
    [x in methodType]: (
      params?: P,
      option?: AxiosRequestConfig
    ) => Promise<checki<any> | checki<T>>
  };

  type BodyMethod<P, T, B> = {
    [x in methodType]: (
      params?: P,
      option?: AxiosData<B>
    ) => Promise<checki<any> | checki<T>>
  };

  // Api 重载.
  function ApiFunc<Params extends object, Body, Res>(
    url: string
  ): BodyMethod<Params, Res, Body>;
  function ApiFunc<Params extends object, Res>(
    url: string
  ): SimpleMethod<Params, Res>;
  function ApiFunc(url: string) {
    const reg = /:(\w+)/gi;

    // why not '?.'
    let keyNames = url.match(reg);
    keyNames = keyNames && keyNames.map(onep => onep.slice(1));
    // console.log(keyNames);
    function CreateProxy(method: methodType) {
      return (params: any = {}, option: AxiosRequestConfig = {}) => {
        const newUrl = parseUrl(params, url);
        const requestOption = {
          url: newUrl,
          ...option,
          method,
        };

        requestOption.headers = {
          ...requestOption.headers,
          Authorization: `Bearer ${app.get("access_token")}`,
          "server-name": app.get("server_name"),
        };
        utilsLog({
          msg: `====== api ${newUrl}请求开始 ======`,
          level: "verbose",
        });
        utilsLog({
          msg: `api 请求option\n${JSON.stringify(requestOption)}\n`,
        });
        return AxiosInstance.request(requestOption)
          .then(res => {
            const dealData = me.successHandler(res);
            utilsLog({
              msg: `api 请求成功，返回参数\n${JSON.stringify(dealData)}\n`,
            });
            utilsLog({
              msg: `====== api ${newUrl}请求结束 ======`,
              level: "verbose",
            });
            return dealData;
          })
          .catch(result => {
            const dealData = me.errorHandler(result);
            utilsLog({
              msg: `api 请求失败返回参数\n${JSON.stringify(dealData)}\n`,
              level: "error",
            });
            utilsLog({
              msg: `====== api ${newUrl}请求结束 ======`,
              level: "verbose",
            });
            return dealData;
          });
      };
    }
    function parseUrl(params: any, url: string) {
      if (Array.isArray(keyNames)) {
        keyNames.forEach(oneKey => {
          url = url.replace(":" + oneKey, params[oneKey] || "");
        });
      }
      // return p.baseURL + "/teams" + url;
      return app.get("baseURL") + "/teams" + url;
    }
    return {
      get: CreateProxy("get"),
      post: CreateProxy("post"),
      put: CreateProxy("put"),
      delete: CreateProxy("delete"),
      patch: CreateProxy("patch"),
    };
  }
  return ApiFunc;
}

export function isResOK<T>(One: checki<any> | checki<T>): One is checki<T> {
  if (One.code !== "6-0000" && One.result) {
    return true;
  } else {
    return false;
  }
}
