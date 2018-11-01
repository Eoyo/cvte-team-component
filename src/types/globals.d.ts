declare module "*.css" {
  const content: {
    [propName: string]: any;
  };
  export default content;
}

declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.less" {
  const content: any;
  export default content;
}

declare module "redux-logger" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const content: object;
  export default content;
}

declare module "qrcode.react" {
  const content: any;
  export default content;
}

interface Window {
  state: any;
  // CefSharp: {
  //   BindObjectAsync(one: string): void;
  // };
  WebViewJavascriptBridge: any;
  WVJBCallbacks: (() => void)[];
}
declare module "vconsole" {
  const content: any;
  export default content;
}

declare module "format-json-pretty" {
  const content: any;
  export default content;
}
