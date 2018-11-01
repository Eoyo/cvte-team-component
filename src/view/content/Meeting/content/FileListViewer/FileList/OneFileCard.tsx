/**
 * 文件列表中一个文件信息的显示.
 */
import * as React from "react";
import { FileMaybeType, UTF8 } from "./analyFIleType";
import { FileViewerOperate } from "../FileViewer";
import { Dropdown } from "antd";
import "./OneFileCard.scss";
import {
  Can,
  loadingCode,
} from "../../../../../../pivot/Meeting/Actor/CommonTypes";
import {
  RUl,
  RLi,
} from "../../../../../common/component/RightClickMenu/RightClikMenuStyled";

const config = {
  uploadFail: "上传失败",
};
export type OneFileCardData = {
  can: Can<"remove">;
  menuCan: Can<FileViewerOperate>;

  uploadSizeStr: string;
  totalSizeStr: string;

  loadingType: loadingCode;
  loadingSizePercentage: number; // 0 - 100;

  fileName: string;
  fileType: FileMaybeType;
};
export type OneFileCardEvents = {
  onView(): void;
  onDelete(): void;
  onReload(): void;
  onDownload(): void;
};
export type OneFileCardProps = OneFileCardData & OneFileCardEvents;
type OneFileMenuProps = {
  state: Can<FileViewerOperate>;
  events: OneFileCardEvents;
};
export const OneFileCard: React.SFC<
  OneFileCardData &
    OneFileCardEvents & {
      deleteFilePop: boolean;
    }
> = p => {
  let menuProps = {
    state: p.menuCan,
    events: {
      onDelete: p.onDelete,
      onView: p.onView,
      onReload: p.onReload,
      onDownload: p.onDownload,
    },
  } as OneFileMenuProps;
  return (
    <Dropdown overlay={menu(menuProps)} trigger={["contextMenu"]}>
      <div
        className={"one-file-card " + p.fileType}
        onDoubleClick={() => {
          p.onDownload();
        }}
      >
        {p.can.remove && (
          <div className="close-icon-btn icon-error" onClick={p.onDelete} />
        )}
        <div className="file-icon" />
        <div className="file-message">
          <div className="file-name" title={p.fileName}>
            {p.fileName}
          </div>
          {p.loadingType === 1 && (
            <div className="size-loading">
              <div className="total-size">{p.totalSizeStr}</div>
              <div className="loading-percentage">
                <div
                  className="loading-percentage-bar"
                  style={{
                    width: p.loadingSizePercentage + "%",
                  }}
                />
              </div>
            </div>
          )}
          {(p.loadingType === 2 || p.loadingType === 0) && (
            <div className="size-loading">
              <div className="total-size">{p.totalSizeStr}</div>
            </div>
          )}
          {p.loadingType === 4 && (
            <div className="size-loading">
              <div className="upload-fail">{config.uploadFail}</div>
              <div className="re-upload-icon" onClick={p.onReload} />
            </div>
          )}
        </div>
      </div>
    </Dropdown>
  );
};

const menu = (p: OneFileMenuProps) => {
  return (
    <RUl>
      {p.state.delete && (
        <RLi
          onClick={() => {
            p.events.onDelete();
          }}
        >
          删除
        </RLi>
      )}
      {/* {p.state.view && (
        <RLi
          onClick={() => {
            p.events.onView();
          }}
        >
          打开
        </RLi>
      )} */}
      {p.state.download && (
        <RLi
          onClick={() => {
            p.events.onDownload();
          }}
        >
          下载
        </RLi>
      )}
    </RUl>
  );
};
