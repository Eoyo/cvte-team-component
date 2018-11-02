import { getQueryVariable } from "../../utils/_tools";
import { message } from "antd";
/*
 * @File:  与native交流协议
 * @Date: 2018-08-02 01:55:27
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-11-01 19:13:36
 */
export * from "./_aircast";
export * from "./_common";
export * from "./_user";
export const system = (() => {
  const PLATFORM = navigator.platform.toLocaleLowerCase();
  const rus = {
    osx: PLATFORM.indexOf("mac") === 0,
    win: PLATFORM.indexOf("win") === 0,
  };
  return rus;
})();
export const NativeCommunicationInit = () => {
  return new Promise((reslove, reject) => {
    // @ts-ignore
    if (isNativeReject()) {
      reject();
    }
    if (system.win) {
      (async function() {
        console.log("in window");
        //向native层注册对象 bridge
        try {
          // @ts-ignore
          await CefSharp.BindObjectAsync("bridge");
          await reslove();
        } catch (e) {
          await reject();
        }
      })();
    } else if (system.osx) {
      console.log("in mac");
      reslove();
    } else {
      reslove();
    }
  });
};

// 是否将Navtive 通讯reject
// 非运行在 client 的reject
// url没有特定参数reject
// 如果非client，又不是develop环境 的 reject
// TODO 等待客户端写UA
// 非客户端环境
const isNativeReject = () => {
  const res =
    getQueryVariable("env") !== "client" &&
    // @ts-ignore
    RUN_ENVIRONMENT !== "CLIENT" &&
    // @ts-ignore
    !(BUILD_ENV === "DEVELOP" && RUN_ENVIRONMENT === "SERVER");
  return res;
};

// TODO 劫持console
// develop 环境，才可以弹出message
export const nativeLogMessage = (title: string, msg?: object) => {
  if (
    // @ts-ignore
    !!(!BUILD_ENV || BUILD_ENV === "DEVELOP")
  ) {
    message.destroy();
    message.info(
      `native back data: [${title}] ===> ${JSON.stringify(msg || {})}`
    );
  }
};
// 将该方法写入 javascript 中
// @ts-ignore
export const setupWebViewJavascriptBridge = (window.setupWebViewJavascriptBridge = (
  callback: any,
  reject?: any
) => {
  // 非客户端，直接reject
  // @ts-ignore
  if (isNativeReject()) {
    typeof reject === "function" && reject();
  }
  // @ts-ignore
  if (window.WebViewJavascriptBridge) {
    // @ts-ignore
    return callback(WebViewJavascriptBridge);
  } else {
  }

  // @ts-ignore
  if (window.WVJBCallbacks) {
    // @ts-ignore
    return window.WVJBCallbacks.push(callback);
  }

  // @ts-ignore
  window.WVJBCallbacks = [callback];

  const WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "https://__bridge_loaded__";
  // @ts-ignore
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    // @ts-ignore
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
});

/* 主动唤起native端  */
function nativeCaller<T, RT extends object>(methodName: string, data?: T): any {
  // 浏览器 reject，并且不catch 会变卡
  if (isNativeReject()) {
    // @ts-ignore
    if (RUN_ENVIRONMENT === "SERVER") {
      return new Promise((resolve, reject) => {
        reject("not in client");
      }).catch(e => {});
    } else {
      return new Promise((resolve, reject) => {
        reject("not in client");
      });
    }
    // 用于给浏览器调试客户端前端资源包
  } else if (getQueryVariable("env") === "browser-client") {
    return new Promise((resolve, reject) => {
      reject("not in client");
    });
  } else {
  }

  if (system.osx) {
    return new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge((bridge: any) => {
        // @ts-ignore
        bridge.callHandler(methodName, data || {}, (response: RT) => {
          // nativeLogMessage(
          //   `${methodName} in mac result = `,
          //   response
          // );
          resolve(response);
        });
      }, reject);
    });
  } else if (system.win) {
    return new Promise((resolve, reject) => {
      try {
        data
          ? (_data => {
              // @ts-ignore
              bridge[methodName](_data).then(
                (response: { ret: number; data: any }) => {
                  // nativeLogMessage(
                  //   `${methodName} in window result = `,
                  //   response
                  // );
                  resolve(response);
                }
              );
            })(data)
          : (() => {
              // @ts-ignore
              bridge[methodName]({}).then(
                (response: { ret: number; data: any }) => {
                  // nativeLogMessage(
                  //   `${methodName} in window result = `,
                  //   response
                  // );
                  resolve(response);
                }
              );
            })();
      } catch (e) {
        reject(e);
      }
    });
  } else {
    return new Promise(resolve => {
      resolve({ ret: 10000000000 });
    });
  }
}

/* native 端回调 */
function nativeListener<RT extends object>(
  methodName: string,
  callback: Function
): any {
  let res;
  if (system.osx) {
    res = new Promise((resolve, reject) => {
      setupWebViewJavascriptBridge((bridge: any) => {
        bridge.registerHandler(methodName, (response: RT, cn = () => {
          nativeLogMessage(`${methodName} in mac result =`, response);
        }) => {
          callback(response);
        });
      }, reject);
    });
  } else if (system.win) {
    // @ts-ignore
    res = new Promise(resolve => {
      window[methodName] = (response: RT) => {
        if (response) {
          if (typeof response === "string") {
            try {
              callback(JSON.parse(response));
            } catch (e) {
              message.info(e.message);
              // callback();
            }
          } else if (typeof response === "object") {
            callback(response);
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      resolve({});
    });
  } else {
    res = new Promise(resolve => {
      resolve({});
    });
  }
  if (isNativeReject()) {
    res.catch((e: any) => {});
    return;
  } else {
    return res;
  }
}

export { nativeCaller, nativeListener };
