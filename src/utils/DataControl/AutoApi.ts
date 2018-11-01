import Axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosTransformer,
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  CancelToken,
} from "axios";
import { checki } from "../checkOperator";
import { app } from "../../stores/app/app";
import { utilsLog } from "../../services/native";

const config = {
  isdevelop: true,
};
// 统一检查状态码的:
function CatchStatus<T>(res: AxiosResponse<T>): checki<any> {
  if (res.status >= 200 && res.status < 300) {
    return {
      ...checki(res.data),
      result: true,
      message: "success @auto-api",
    };
  } else {
    if (res.data) {
      const code = res.data["code"] || res.status;
      return {
        ...checki(res.data),
        result: false,
        message: config.isdevelop
          ? (res.data["message"] || res.data || "fail @auto-api") +
            "@code::" +
            code
          : "操作失败(" + code + ")",
        ...(res.data["code"] ? { code: res.data["code"] } : {}),
      };
    } else {
      return {
        ...checki(res.data),
        result: false,
        message: "fail @auto-api",
      };
    }
  }
}

interface OptionsAxiosData<Body, Head> {
  url?: string;
  method?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: Head;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: Body;
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
interface BaseAxiosData<Head> {
  baseURL: string | (() => string);
  headers?: Head;
}
type methodType = "get" | "post" | "del" | "patch" | "put";
/**
 *
 */

function parseUrl(params: any, url: string, keyNames: any, baseURL: string) {
  const copy = { ...params };
  for (let i in copy) {
    copy[i] = encodeURIComponent(copy[i]);
  }
  if (Array.isArray(keyNames)) {
    keyNames.forEach(oneKey => {
      //把query部分替换成要塞入的内容，如果为空，则清除query部分
      url = url.replace(
        "&" + oneKey + "={" + oneKey + "}",
        copy[oneKey] ? "&" + oneKey + "=" + copy[oneKey] : ""
      );
      url = url.replace(
        oneKey + "={" + oneKey + "}",
        copy[oneKey] ? oneKey + "=" + copy[oneKey] : ""
      );
      url = url.replace("{" + oneKey + "}", copy[oneKey] || "");
    });
    if (url.indexOf("?") == url.length - 1) {
      url = url.replace("?", "");
    } else {
      url = url.replace("?&", "?");
    }
  }
  return baseURL + url;
}
const handler = {
  successHandler: CatchStatus,
  // 出错时可能没有response!!
  // 跨域时没有response, 断网也没有response
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

export type oneValue = string | (() => string);
export type calculate = { [x: string]: string | (() => string) };
function getValue(one: oneValue) {
  if (typeof one === "function") {
    return one();
  } else {
    return one;
  }
}
function calculateValue(obj: calculate) {
  const rus: { [x: string]: string } = {};
  for (const x in obj) {
    rus[x] = getValue(obj[x]);
  }
  return rus;
}

function onlyStringNode(obj: object) {
  const rus = {};
  Object.getOwnPropertyNames(obj).forEach(x => {
    let one = obj[x];
    if (typeof one === "object" && !Array.isArray(obj)) {
      rus[x] = onlyStringNode(one);
    } else if (typeof one === "string") {
      rus[x] === one;
    }
  });
  return rus;
}
export function AutoApi(
  p: BaseAxiosData<{ [x: string]: string | (() => string) }>
) {
  const AxiosInstance = Axios.create(onlyStringNode(p));

  type ApiGadget<P, B, H, R> = {
    [x in methodType]: (
      params?: P,
      option?: OptionsAxiosData<B, H>
    ) => Promise<checki<any> | checki<R>>
  };
  function ApiFunc<P, B, H, R>(url: string): ApiGadget<P, B, H, R> {
    const reg = /{(\w+)}/gi;
    let keyNames = url.match(reg);
    keyNames = keyNames && keyNames.map(onep => onep.slice(1, -1));

    function CreateProxy(method: methodType) {
      return (params: any = {}, option: AxiosRequestConfig = {}) => {
        const calculateBaseURL = getValue(p.baseURL);

        const newUrl = parseUrl(
          params,
          url,
          keyNames,
          // @ts-ignore; p.baeURL is string;
          calculateBaseURL
        );
        const requestOption = {
          url: newUrl,
          ...option,
          method,
        };

        // headers AutoApi定义的优先.
        requestOption.headers = {
          ...requestOption.headers,
          ...calculateValue(p.headers || {}),
        };
        utilsLog({
          msg: `====== api ${newUrl}请求开始 ======`,
          level: "verbose",
        });
        utilsLog({
          msg: `api 请求option\n${JSON.stringify(requestOption)}\n`,
        });
        let requestIn;
        try {
          requestIn = AxiosInstance.request(requestOption)

            .then(res => {
              const dealData = handler.successHandler(res);
              // utilsLog({
              //   msg: `api 请求成功，返回参数\n${JSON.stringify(dealData)}\n`,
              // });
              utilsLog({
                msg: `====== api ${newUrl}请求结束 ======`,
                level: "verbose",
              });
              return dealData;
            })
            .catch(result => {
              const dealData = handler.errorHandler(result);
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
        } catch (e) {
          utilsLog({
            msg: e.message,
            level: "error",
          });
        }
        return requestIn;
      };
    }

    // @ts-ignore;
    let iProxy = window.Proxy;

    if (iProxy) {
      return new Proxy(
        {
          get: "get",
          del: "delete",
          post: "post",
          patch: "patch",
          put: "put",
        },
        {
          get(target, key) {
            const method = target[key];
            if (method) {
              return CreateProxy(method);
            } else {
              return Reflect.get(target, key);
            }
          },
          set(target, key, value) {
            console.log("can't set value !");
            return false;
          },
        }
      ) as any;
    } else {
      return {
        get: CreateProxy("get"),
        del: CreateProxy("del"),
        post: CreateProxy("post"),
        patch: CreateProxy("patch"),
        put: CreateProxy("put"),
      };
    }
  }
  return ApiFunc;
}
