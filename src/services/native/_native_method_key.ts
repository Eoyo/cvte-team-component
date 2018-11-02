export const UTIL_LOG = "utils_log";

/* ============== 通用 common start ============== */
// 清空WebView Cookies缓存
export const UTILS_CLEANALLCOOKIES = "utils_cleanAllCookies";

// 日志接口
export const UTILS_LOG = "utils_log";

// 缓存数据
export const UTILS_SETVALUEFORKEY = "utils_setValueForKey";

// 读取缓存数据
export const UTILS_VALUEFORKEY = "utils_valueForKey";

// 更新webview文件上传配置
export const CONFIG_SETWEBVIEWCONFIG = "config_setWebViewConfig";

//浏览器打开链接
export const UTILS_OPENURL = "utils_openUrl";

// 消息通知
export const PUSH_REAL_TIME_MESSAGE = "pushRealTimeMessage";

// 推送通知
export const PUSH_NOTIFICATION_MESSAGE = "pushNotificationMessage";

// 服务器配置

// 获取当前配置的服务器domain
export const CONFIG_GETSERVERDOMAIN = "config_getServerDomain";
// 获取当前配置的服务器名字
export const CONFIG_GETSERVERNAME = "config_getServerName";
// 获取当前会议预约服务器domain
export const CONFIG_GETMRBSDOMAIN = "config_getMrbsDomain";
// 开始拖拽窗口
export const UTILS_START_WINDOW_DRAG = "utils_startWindowDrag";
// 停止拖拽窗口
export const UTILS_STOP_WINDOW_DRAG = "utils_stopWindowDrag";
// 关闭窗口
export const UTILS_CLOSE_WINDOW = "utils_closeWindow";
// 最大化窗口
export const UTILS_MAXIMIZE_WINDOW = "utils_maximizeWindow";
// 正常化窗口
export const UTILS_NORMALIZE_WINDOW = "utils_normalizeWindow";
// 最小化窗口
export const UTILS_MINIMIZEWINDOW = "utils_minimizeWindow";
// 窗口大小状态回调
export const UTILS_ON_WINDOW_STATE_CHANGED = "utils_onWindowStateChanged";

// 获取程序版本
export const UTILS_GET_APP_VERSION = "utils_getAppVersion";

// 注册实时消息events
export const UTILS_GET_REALTIME_MESSAGE_EVENTS =
  "utils_provideRealTimeMessageEvents";

// 获取friday events key
export const CONFIG_GET_FRIDAY_APPID = "config_getFridayAppId";

/* ============== 通用 common end ============== */

/* ============== 用户 user start ============== */

// 获取AccessToken
export const AUTH_GETACCESSTOKEN = "auth_getAccessToken";

// 获取用户信息
export const AUTH_GETUSERINFO = "auth_getUserInfo";
//   退出登录
export const LOGOUT = "auth_logout";
/* ============== 用户 user end ============== */

/* ============== 投屏 aircast start ============== */
// 连接投屏
export const AIR_CONNECT = "air_connect";

// 开始投屏
export const AIR_STARTCAST = "air_startCast";

// 停止投屏
export const AIR_STOPCAST = "air_stopCast";

// 断开投屏
export const AIR_DISCONNECT = "air_disconnect";

// 连接状态回调接口
export const AIR_ONCONNECTED = "air_onConnected";

// 断开连接状态回调
export const AIR_ONDISCONNECTED = "air_onDisconnected";

// 开始投屏状态回调
export const AIR_ONSTARTED = "air_onStarted";

// 停止投屏状态回调
export const AIR_ONSTOPPED = "air_onStopped";

// 连接后中途出错回调
export const AIR_ONERROR = "air_onError";

/* ============== 投屏 aircast end ============== */
