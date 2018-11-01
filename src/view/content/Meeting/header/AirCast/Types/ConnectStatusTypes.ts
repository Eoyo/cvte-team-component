export const [CONNECT_LOADING, START_LOADING, CONNECTED, ERROR] = [
  "connectLoading",
  "startLoading",
  "connected",
  "error",
];
export const connectStatus = {
  CONNECT_LOADING,
  START_LOADING,
  CONNECTED,
  ERROR,
};
export type TypeConnectStatus = {
  status: string;
  errorCode: number;
};
