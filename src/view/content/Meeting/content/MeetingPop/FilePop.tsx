/**
 * FilePop,
 */
import "./FilePop.scss";
import * as React from "react";
import { Button } from "antd";
import { PopCard } from "../../../../common/component/Pop/PopCard";
import { MeetingTypes } from "../../../../../pivot/Meeting/Actor/MeetingTypes";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { Ele } from "../../../../common/ts-styled/ele";
export type FilePopProps = {
  visible: boolean;
  onConfirm(b: boolean): void;
};

// sfc

const tooMany: React.SFC<FilePopProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"file-pop-content"}
      onClickBg={() => {
        p.onConfirm(false);
      }}
    >
      <p className="p-message-title">文件数量不能超过10个</p>
      <div className="btn-line">
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm(true);
          }}
        >
          好的
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
};
const tooBig: React.SFC<FilePopProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"file-pop-content"}
      onClickBg={() => {
        p.onConfirm(false);
      }}
    >
      <p className="p-message-title">不能添加超过10M的文件</p>
      <div className="btn-line">
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm(true);
          }}
        >
          好的
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
};

const wrongType: React.SFC<FilePopProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"file-pop-content"}
      onClickBg={() => {
        p.onConfirm(false);
      }}
    >
      <p className="p-message-title">暂不支持此类文件上传</p>
      <div className="btn-line">
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm(true);
          }}
        >
          好的
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
};
const someWrong: React.SFC<FilePopProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"meeting-pop file-pop-content"}
      onClickBg={() => {
        p.onConfirm(false);
      }}
    >
      <p className="p-title">部分文件无法上传</p>
      <p className="p-message">
        不支持音视频上传, 单个文件不可超过 10M, 最多上传10个文件
      </p>
      <div className="btn-line">
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm(true);
          }}
        >
          好的
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
};

const DeleteFile: React.SFC<FilePopProps> = p => {
  return (
    <PopCard
      visible={p.visible}
      popContentClassName={"meeting-pop file-pop-content"}
      onClickBg={() => {
        p.onConfirm(false);
      }}
    >
      <p className="p-message-title">确定删除该文件吗？</p>
      <div className="btn-line">
        <Ele.secondBtn
          onClick={() => {
            p.onConfirm(false);
          }}
        >
          取消
        </Ele.secondBtn>
        <div className="block-divider" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            p.onConfirm(true);
          }}
        >
          确定
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
};

const PopGroup = {
  tooMany,
  tooBig,
  someWrong,
  wrongType,
};

// connect

export const C_FilePopGroup = ([
  "someWrong",
  "tooBig",
  "tooMany",
  "wrongType",
] as (keyof MeetingTypes.filePopshow)[]).map(name => {
  const OneFilePop = MeetingConnect<FilePopProps>(s => {
    return {
      visible: s.meetingPage.messageShow[name],
      onConfirm(b) {
        Meeting.popShow({
          opeType: name,
          show: false,
        });
      },
    };
  })(p => {
    const FilePop = PopGroup[name];
    return <FilePop {...p} />;
  });
  return <OneFilePop key={name} />;
});

export const C_DeleteFile = MeetingConnect<FilePopProps>(s => {
  return {
    visible: s.showDeleteFilePopCard,
    onConfirm(b) {
      Meeting.popShow({
        opeType: name,
        show: false,
      });
      if (b) {
        Meeting.deleteFile({
          fileId: s.deleteFileId,
        });
        Meeting.showDeleteFileModal({
          show: false,
          fileId: "",
        });
      } else {
        Meeting.showDeleteFileModal({
          show: false,
          fileId: "",
        });
      }
    },
  };
})(p => <DeleteFile {...p} />);
