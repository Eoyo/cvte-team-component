/**
 * 管理文件的上传
 */

import { Act } from "../../../../stores/Actor/actor";
import { MeetingTypes } from "../MeetingTypes";
import { Meeting } from "../MeetingActor";
import { message } from "antd";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { checki } from "../../../../utils/checkOperator";
import { Merge } from "../../../../stores/Actor/tool";
import { fileLoader } from "../../../../services/file/file";
import { isParameter } from "typescript";
import { auto } from "../../../../services/auto/spore";
const Base64 = require("js-base64").Base64;
import Axios from "axios";
import { resLog } from "../Tools/log";
import { FileViewerOperate } from "../../../../view/content/Meeting/content/FileListViewer/FileViewer";
import { OneFileCardData } from "../../../../view/content/Meeting/content/FileListViewer/FileList/OneFileCard";
import {
  getPostFix,
  getFileType,
  UTF8,
} from "../../../../view/content/Meeting/content/FileListViewer/FileList/analyFIleType";
import { fridayPushData } from "src/friday";

export const uploadFile = Act<MeetingTypes.InitState>()({
  addUploaderFile: {
    files: {} as FileList,
  },
  showDeleteFileModal: {
    show: false,
    fileId: "",
  },
  deleteFile: {
    fileId: "",
  },
  uploadFile: {
    oneFile: {} as MeetingTypes.UploaderFile,
  },
  reLoadFile: {
    oneFile: {} as MeetingTypes.UploaderFile,
  },
  showFileMenu: {},
  operateOneFile: {
    opeType: "" as FileViewerOperate,
    oneFile: {} as MeetingTypes.OneFile,
    shareId: "",
    shareKey: "",
  },
})({
  showDeleteFileModal: function*(s, a) {
    yield {
      showDeleteFilePopCard: a.show,
      deleteFileId: a.fileId,
    };
  },
  operateOneFile: function*(s, a) {
    const status = s.meetingData.status;
    switch (a.opeType) {
      case "delete":
        if (status === "schedule") {
          Meeting.deleteFile({
            fileId: a.oneFile.id,
          });
        } // else {};
        break;
      case "download":
      // 客户端下载;
    }
    return {};
  },
  showFileMenu: (s, a) => {
    return {};
  },
  // 将状态标记为可以上传就ok
  reLoadFile: function*(s, a) {
    a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
      loadingType: 0,
    });
    Meeting.uploadFile({ oneFile: a.oneFile });
    return {};
  },

  // 操作的是对象的引用(数组保护)
  // @@!!由于generate 函数的异步执行导致最后一次进度的更新比成功的回调慢.
  uploadFile: function*(s, a) {
    const fileList = s.meetingPage.uploadFiles;
    const fileData = new FormData();
    fileData.append("name", a.oneFile.file.name);
    // message.info("start upload file");
    if (fileList.indexOf(a.oneFile) === -1) {
      // message.error("no this file" + fileData.get("name"));
      return {};
    }

    // message.info("file code ::" + a.oneFile.card.loadingType);
    switch (a.oneFile.card.loadingType) {
      case 0:
        // message.info("start to read the file");
        const formData = new FormData();

        formData.append("file", a.oneFile.file);
        formData.append("name", a.oneFile.file.name);
        formData.append("contentType", getPostFix(a.oneFile.file.name));
        formData.append("autoCommit", "true");

        // try {
        //   message.info("fileName::" + (formData.get("name") as any).toString());
        // } catch (err) {
        //   message.info(err + "");
        // }

        a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
          loadingType: 1,
        });
        yield {
          meetingPage: {
            uploadFiles: [...fileList],
          },
        };
        //如果不是预约会议，那么就需要进行关联共享文件的操作
        if (s.meetingData.status !== "schedule") {
          const CancelToken = Axios.CancelToken;
          const source = CancelToken.source();
          let file = fileList.find(param => {
            return param.id === a.oneFile.id;
          });
          if (file) {
            file.cancel = source.cancel;
          }
          yield {
            meetingPage: {
              uploadFiles: [...fileList],
            },
          };
          const shareRes: checki<any> = yield fileLoader.shareFile(
            {
              shareId: s.meetingData.shareId,
            },
            {
              data: formData,
              onUploadProgress(pg: ProgressEvent) {
                // 更新进度
                a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
                  loadingSizePercentage: ((pg.loaded / pg.total) * 100) | 0,
                  loadingType: pg.loaded / pg.total === 1 ? 2 : 1,
                });
                Meeting.uploadFile({
                  oneFile: a.oneFile,
                });
                console.log("progress", pg);
              },
              headers: {
                "X-Share-Key": Base64.encode(s.meetingData.shareKey),
              },
              cancelToken: source.token,
            }
          );
          if (resOK(shareRes)) {
            a.oneFile.downloadUrl = shareRes.value.file.downloadUrl;
            a.oneFile.id = shareRes.value.file.id;
          } else {
            let response: any = shareRes;
            //如果主动取消，就不要返回上传的这个文件了
            if (response.value.message === "cancel upload file") {
              return {};
            }
            a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
              loadingType: 4,
            });
          }
        } else {
          const CancelToken = Axios.CancelToken;
          const source = CancelToken.source();
          let file = fileList.find(param => {
            return param.id === a.oneFile.id;
          });
          if (file) {
            file.cancel = source.cancel;
          }
          yield {
            meetingPage: {
              uploadFiles: [...fileList],
            },
          };
          const res: checki<any> = yield fileLoader.saveFile(
            {},
            {
              data: formData,
              onUploadProgress(pg: ProgressEvent) {
                // 更新进度
                a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
                  loadingSizePercentage: ((pg.loaded / pg.total) * 100) | 0,
                });
                Meeting.uploadFile({
                  oneFile: a.oneFile,
                });
                console.log("progress", pg);
              },
              cancelToken: source.token,
            }
          );
          if (resOK(res)) {
            a.oneFile.downloadUrl = res.value.downloadUrl;
            a.oneFile.id = res.value.id;
            a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
              loadingType: 2,
            });
          } else {
            let response: any = res;
            if (response.value.message === "cancel upload file") {
              return {};
            } else {
              a.oneFile.card = Merge<OneFileCardData>(a.oneFile.card, {
                loadingType: 4,
              });
            }
          }
        }
        break;
      case 1: // 更新进度
      case 2:
      case 3:
      case 4:
        break;
    }
    return {
      meetingPage: {
        uploadFiles: [...fileList],
      },
    };
  },

  // 同步的检查和添加需要上传的文件.
  addUploaderFile: (s, a) => {
    console.log(a);
    const fileList: MeetingTypes.UploaderFile[] = [];
    const len = a.files.length;
    const maxSize = 10;

    if (len + fu(s).length + s.meetingPage.viewFiles.length > maxSize) {
      // message.info(
      //   `文件数量将超过最大数量(最大数量为: ${maxSize}), 请选少一点`
      // );
      setTimeout(() => {
        Meeting.popShow({
          opeType: "tooMany",
          show: true,
        });
      });
      return {};
    }
    let noWrong = true;
    let onlyOne = len <= 1;
    for (let i = 0; i < len; i += 1) {
      const file = a.files[i];

      if (false === filterSuitableFile(file, onlyOne)) {
        noWrong = false;
        continue;
      }
      const fileType = getFileType(file.name);
      // message.info(file.name);

      // 构建一个参数对象
      const oneFile: MeetingTypes.UploaderFile = {
        card: {
          can: {
            remove: s.meetingData.status === "schedule",
          },
          // 权限交给lock 处理
          menuCan: {
            delete: false,
            view: false,
            upload: false,
            download: false,
            remove: false,
          },
          uploadSizeStr: getFileSize(file.size),
          totalSizeStr: getFileSize(file.size),

          loadingType: 0,
          loadingSizePercentage: 0,

          fileName: file.name,
          fileType: fileType,
        },
        file: file,
        id: getFileId(), // 需要为每个未上传的文件伪造id
        downloadUrl: "",
      };

      fileList.push(oneFile);

      setTimeout(() => {
        Meeting.uploadFile({
          oneFile: oneFile,
        });
      });
    }

    if (!noWrong && !onlyOne) {
      setTimeout(() => {
        Meeting.popShow({ opeType: "someWrong", show: true });
      });
    }
    // 上传会议文件
    fridayPushData({
      event: "upload",
      attr: {
        meetingId: s.aimAtMeetingId,
      },
      eventName: "MEETING_FILE_UPLOAD",
    });
    return {
      meetingPage: {
        uploadFiles: [...fu(s), ...fileList],
      },
    };
  },
  deleteFile: function*(s, a) {
    const oldUploadFileList = [...s.meetingPage.uploadFiles];
    const oldViewFileList = [...s.meetingPage.viewFiles];
    const schedule = s.meetingData.status === "schedule";
    let shareId = s.meetingData.shareId;
    let shareKey = s.meetingData.shareKey;
    let file: any = oldUploadFileList.find(param => {
      return param.id === a.fileId;
    });
    if (file === undefined) {
      file = oldViewFileList.find(param => {
        return param.id === a.fileId;
      });
    }

    //如果是正在上传的文件，直接取消上传, file.cancel时阻止上传的中断函数.
    if (file && file.cancel && file.card.loadingType === 1) {
      file.cancel &&
        file.cancel("cancel upload file") &&
        (file.cancel = undefined);
    } else if (!schedule && file.card.loadingType !== 4) {
      //如果已经是成功状态的文件，就调用接口删除
      const res: checki<any> = yield fileLoader.deleteFile(
        {
          itemId: a.fileId,
          shareId: shareId,
        },
        {
          headers: {
            "X-Share-Key": Base64.encode(shareKey),
          },
        }
      );
      if (!resOK(res)) {
        resLog(res);
        return {};
      }
    }

    // 删除file的内存记录
    return {
      meetingPage: {
        uploadFiles: [
          ...oldUploadFileList.filter(file => file.id !== a.fileId),
        ],
        viewFiles: [...oldViewFileList.filter(file => file.id !== a.fileId)],
      },
    };
  },
});

let id = 0;
function getFileId() {
  id++;
  return "file-id-" + id;
}

// file uploader
function fu(s: MeetingTypes.InitState) {
  return s.meetingPage.uploadFiles;
}
const units = ["b", "kb", "M", "G", "T"];
const oneUnitSize = 1000;
function getFileSize(size: number) {
  for (let i = 0; i < units.length; i++) {
    let transSize = size / oneUnitSize;
    if (transSize < 1) {
      if (i <= 1) {
        return Math.round(size) + units[i];
      } else {
        return size.toFixed(1) + units[i];
      }
    } else {
      size = transSize;
    }
  }
  return "to Big!!";
}

function filterSuitableFile(file: File, showEveryOne: boolean) {
  const maxFileSize = 10000000; // 10M

  // 忽略不对的
  if (file.size >= maxFileSize) {
    // message.error(`文件‘${file.name}’出错, 大小超过了10M, 已经自动略过此文件`);
    showEveryOne &&
      setTimeout(() => {
        Meeting.popShow({
          opeType: "tooBig",
          show: true,
        });
      });
    return false;
  }
  const fileType = getFileType(file.name);
  if (fileType === "unknown") {
    // message.error(`文件‘${file.name}’出错, 暂时不支持此类文件`);
    showEveryOne &&
      setTimeout(() => {
        Meeting.popShow({
          opeType: "wrongType",
          show: true,
        });
      });
    return false;
  }

  return true;
}
