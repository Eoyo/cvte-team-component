import Axios, { AxiosResponse, AxiosRequestConfig } from "axios";

// parse params into url
const parseUrl = (url: string, params = {}) => {
  const reg = /:(\w+)/gi;
  const urlParams = url.match(reg);
  if (Array.isArray(urlParams)) {
    urlParams.forEach(urlParam => {
      const keyName = urlParam.replace(":", "");
      url = url.replace(":" + keyName, params[keyName] || "");
      delete params[keyName];
    });
  }

  const lastParam = Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");

  if (/\?/.test(url)) {
    return `/api${url}&${lastParam}`;
  } else {
    return `/api${url}?${lastParam}`;
  }
};
const wrapRequestOption = (url: string, option: any) => {
  return {
    url: parseUrl(url, option),
    data: option,
  };
};

class Request {
  // private isDevelopment = false;
  private axiosInstance = Axios.create({
    // baseURL: "http://localhost:9100",
    timeout: 5000,
    headers: {},
    // withCredentials: true,
    // transformRequest: [
    //   (data, headers) => {
    //     return data;
    //   },
    // ],
    // transformResponse: [
    //   data => {
    //     console.log({ ...data }, "dada");
    //     return data;
    //   },
    // ],
  });
  // private axiosInstance = Axios;
  public Get<T>(apiUrl: string, option?: T & AxiosRequestConfig) {
    const requestOption = {
      ...wrapRequestOption(apiUrl, option),
      method: "get" as "get",
    };
    return (
      this.axiosInstance
        .request(requestOption)
        .then(res => this.handelResponse(res))
        // .then(result => this.handleError(result))
        .catch(result => this.preHandler(result))
    );
  }
  public Post(apiUrl: string, option?: AxiosRequestConfig) {
    const requestOption = {
      ...wrapRequestOption(apiUrl, option),
      method: "post" as "post",
    };
    return (
      this.axiosInstance
        .request(requestOption)
        .then(res => this.handelResponse(res))
        // .then(result => this.handleError(result))
        .catch(result => this.preHandler(result))
    );
  }
  public Put(apiUrl: string, option?: AxiosRequestConfig) {
    const requestOption = {
      ...wrapRequestOption(apiUrl, option),
      method: "put" as "put",
    };
    return (
      this.axiosInstance
        .request(requestOption)
        .then(res => this.handelResponse(res))
        // .then(result => this.handleError(result))
        .catch(result => this.preHandler(result))
    );
  }
  public Delete(apiUrl: string, option?: AxiosRequestConfig) {
    const requestOption = {
      ...wrapRequestOption(apiUrl, option),
      method: "delete" as "delete",
    };
    return (
      this.axiosInstance
        .request(requestOption)
        .then(res => this.handelResponse(res))
        // .then(result => this.handleError(result))
        .catch(result => this.preHandler(result))
    );
  }
  private handelResponse(res: AxiosResponse): { ok: boolean; data: any } {
    console.log(res, "res");
    switch (res.status) {
      case 200:
        console.log("200", res.data);
        return res.data;
      case 401:
        return {
          ok: false,
          data: res.data ? res.data : "401",
        };
      default:
        return {
          ok: false,
          data: res.data ? res.data : "未分类的错误,status" + res.status,
        };
    }
  }
  // private handleError(result: {
  //   ok: boolean;
  //   data: any;
  // }) {
  //   if (result.ok) {
  //     return result.data;
  //   } else {
  //     this.showError(result.data);
  //     return false;
  //   }
  // }
  /**
   * Network error
   */

  private preHandler(err: any) {
    const { response } = err;
    console.log("preHandler", response);
    if (!response || !response.status) {
      return "网络出错";
    } else {
      return response;
    }
  }

  /**
   * 这里可能需要集成vconsole
   */
  // private showError(msg: any) {
  //   console.log(msg, "msg");
  //   if (this.isDevelopment) {
  //     alert(msg);
  //   } else {
  //     console.log(msg);
  //   }
  // }
}

export default new Request();
