export enum ConnectStatus {
  connect_loading = "connectLoading",
  connect_error = "connectError",
  network_error = "networkError",
  start_loading = "startLoading",
  connected = "connected",
}
export type TypeConnectStatus = {
  status: ConnectStatus;
  errorCode: number;
};
