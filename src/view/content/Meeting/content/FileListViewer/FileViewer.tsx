/**
 * 文件显示列表
 * 1. 使用了 rc-uploader;
 */
import * as React from "react";
import { OneFileCardProps, OneFileCard } from "./FileList/OneFileCard";
import "./FileViewer.scss";
import _ from "lodash";

import { TitleLine, TitleTool, HrLine } from "../common/Layout/TitleLine";
import { C_fileLableInput, C_fileDragDrop } from "./FileGetter";
import {
  utilsOpenUrl,
  UTILS_OPENURL_RESPONSE_TYPE,
  utilsLog,
  nativeLogMessage,
} from "../../../../../services/native";
import { MeetingTypes } from "../../../../../pivot/Meeting/Actor/MeetingTypes";
import {
  getFileMenuCan,
  getMeetingStatus,
} from "../../../../../pivot/Meeting/Actor/utils";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { Counter } from "../common/Counter/Counter";
import { flex } from "../../../../common/ts-styled/flex";
import styled, { css } from "styled-components";
import {
  MeetingBlockCard,
  BlockCardContent,
} from "../common/Layout/MeetingBlockCard";

// 相对组件不变的数据or函数.
const config = {
  noFile: "可将文件直接拖到这里",
};
export type FileViewerOperate =
  | "delete"
  | "view"
  | "upload"
  | "download"
  | "remove";

export type FileViewerProps = {
  role: MeetingTypes.PersonRole;
  status: any;
  fileList: OneFileCardProps[];
  maxSize: number;
  errorPop: {
    message: string;
    show: boolean;
  };
  deleteFilePop: boolean;
};

export const S_fileDragPlaceHolder = styled("div")`
  --styled: "S_fileDragPlaceHolder";
  font-size: 12px;
  min-height: 50px;
  ${flex.columnCenter};
`;
export const FileDrapPlaceHolder: React.SFC<{}> = p => {
  return (
    <S_fileDragPlaceHolder>
      <div>可将文件直接拖到这里（单个文件10M以内，不支持音视频文件）</div>
    </S_fileDragPlaceHolder>
  );
};

export const FileViewerContent = styled(BlockCardContent)`
  --styled: "FileViewerContent";
  .drag-drop {
    margin-top: -10px;
    margin-bottom: -10px;
  }
`;

// sfc
export const FileViewer: React.SFC<FileViewerProps> = p => {
  // 数据的约束
  const lock = {
    sum: p.fileList.length,
    isFull: p.fileList.length >= p.maxSize,
  };
  let showInputFile = getFileMenuCan(p.role, p.status).upload;
  return (
    <div className="file-viewer">
      <TitleLine
        name={
          <span>
            会议文件
            <Counter num={lock.sum} sum={10} />
          </span>
        }
        tool={
          <TitleTool>
            {lock.isFull ? (
              <span>文件数量已达上限</span>
            ) : showInputFile ? (
              <C_fileLableInput />
            ) : null}
          </TitleTool>
        }
      />
      <FileViewerContent>
        <C_fileDragDrop
          isEmpty={!p.fileList.length}
          placeHolder={<FileDrapPlaceHolder />}
        >
          {p.fileList.map((oneFile, id) => {
            return (
              <OneFileCard
                {...oneFile}
                deleteFilePop={p.deleteFilePop}
                key={id}
              />
            );
          })}
        </C_fileDragDrop>
      </FileViewerContent>
    </div>
  );
};

export const S_FileViewerCard = styled(MeetingBlockCard)`
  --styled: "S_FileViewerCard";
  /* padding-bottom: 20px; */
  ${HrLine} {
    display: none;
  }
  ${FileViewerContent} {
    padding-top: 10px;
  }
  ${(p: { withLine?: boolean }) => {
    if (p.withLine) {
      return css`
        ${HrLine} {
          display: block;
        }
      `;
    } else {
      return;
    }
  }};
`;

// Schedule FileViewer;
export const C_FileViewerCard = MeetingConnect(s => {
  let viewFiles = s.meetingPage.viewFiles;
  let viewFileList = viewFiles.map(
    _.memoize(onep => {
      const rus: OneFileCardProps = {
        ...onep.card,
        onReload() {},
        onDelete() {
          Meeting.showDeleteFileModal({
            show: true,
            fileId: onep.id,
          });
        },
        onView() {},
        onDownload() {
          utilsLog({ msg: "start down load url\n" });
          utilsLog({ msg: `url is ${onep.downloadUrl}\n` });
          utilsOpenUrl({
            url: onep.downloadUrl,
          })
            .then((res: UTILS_OPENURL_RESPONSE_TYPE) => {
              utilsLog({ msg: "open url success\n" });
              if (res.ret === 0) {
                //下载正确
                utilsLog({ msg: "open url success\n" });
              } else {
                //下载失败
                utilsLog({ msg: "open url failed\n" });
              }
            })
            .catch((e: any) => {
              nativeLogMessage(e);
              utilsLog({ msg: "open url failed\n" });
              //下载失败
            });
        },
      };
      return rus;
    })
  );
  let uploadFiles = s.meetingPage.uploadFiles;
  let uploadFileList = uploadFiles.map(
    _.memoize(onep => {
      const rus: OneFileCardProps = {
        ...onep.card,
        onReload() {
          Meeting.reLoadFile({ oneFile: onep });
        },
        onDelete() {
          Meeting.showDeleteFileModal({
            show: true,
            fileId: onep.id,
          });
        },
        onView() {},
        onDownload() {
          utilsOpenUrl({
            url: onep.downloadUrl,
          })
            .then(({ ret }: { ret: number }) => {
              utilsLog({ msg: "open url success\n" });
              if (ret === 0) {
                //下载正确
                utilsLog({ msg: "open url success\n" });
              } else {
                //下载失败
                utilsLog({ msg: "open url failed\n" });
              }
            })
            .catch((e: any) => {
              utilsLog({ msg: "open url failed\n" });
              //下载失败
            });
        },
      };
      return rus;
    })
  );
  let fileList = viewFileList.concat(uploadFileList);
  const meetingStatus = getMeetingStatus(s);
  return {
    // 当会议归档了或是接受的邀请, 且没有文件就不显示.
    show: !(
      (meetingStatus === "summary" || meetingStatus === "inviting") &&
      fileList.length === 0
    ),
    fileViewer: {
      role: s.meetingPerson.role,
      status: getMeetingStatus(s),
      fileList,
      errorPop: {
        message: "",
        show: false,
      },
      maxSize: 10,
      deleteFilePop: s.showDeleteFilePopCard,
    },
  };
})<{
  noCard?: boolean;
}>(p => {
  if (p.noCard) {
    return <FileViewer {...p.fileViewer} />;
  } else {
    if (p.show) {
      return (
        <S_FileViewerCard withLine={p.fileViewer.fileList.length > 0}>
          <FileViewer {...p.fileViewer} />
        </S_FileViewerCard>
      );
    } else {
      return null;
    }
  }
});
