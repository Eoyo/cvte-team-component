import { SFC } from "react";
import * as React from "react";
import "./Avatar.scss";
import { getITAvatarUrl } from "src/services/avatar";
import { Popover } from "antd";
import { arrCss } from "src/utils/export";

export type member = {
  userId?: string;
  name?: string;
  avatarUrl: string;
};
export type avatarType = {
  members: member[];
  name: string;
};
const getFirstText = (str: string) => {
  return str.slice(0, 1);
};
const generateRandomStyle = (id: number) => {
  const style = ((id % 10) % 5) + 1;
  return " avatar-style" + style;
};

// 图片src 的缓存
const imageLoad = { "": false } as { [x: string]: boolean };

type CacheImageProps = {
  src?: string;
  className?: string;
};
// 使用
class CacheImage extends React.Component<CacheImageProps> {
  state = {
    loaded: imageLoad[this.props.src || ""] || false,
    src: this.props.src,
  };
  img: HTMLImageElement | null = null;
  checkLoad() {
    if (!this.state.loaded && this.props.src) {
      this.img = new Image();
      let src = this.props.src;
      this.img.src = src;
      this.img.onload = () => {
        imageLoad[src] = true;
        this.setState({
          loaded: true,
        });
      };
    }
  }
  componentWillUnmount() {
    if (this.img) {
      this.img.onload = null;
      this.img = null;
    }
  }
  setSrcFromProps() {
    this.state = {
      loaded: imageLoad[this.props.src || ""] || false,
      src: this.props.src,
    };
  }

  render() {
    this.setSrcFromProps();
    this.checkLoad();

    const p = this.props;
    if (this.state.loaded) {
      return (
        <div
          style={{
            backgroundImage: `url(${this.state.src})`,
          }}
          className={arrCss(["IT-image-avatar", p.className])}
        />
      );
    } else {
      return (
        <div
          className={p.className}
          style={{
            backgroundImage: `url(/assets/images/default_avatar/avatar2.svg)`,
          }}
        />
      );
    }
  }
}

export type iAvatarProps = {
  className?: string;
  teamsName?: string;
  avatarUrl?: string;
  teamsId?: string;
  onClick?: Function;
  children?: any;
  email?: string;
};

const Avatar: SFC<iAvatarProps> = p => {
  let className = `${p.className || ""} avatar-wrap`;

  // 使用cvte的头像
  const isRandom = p.teamsName || !!!p.avatarUrl;
  className = isRandom
    ? className + generateRandomStyle(Number(p.teamsId || 0))
    : className;

  return (
    <div
      className={arrCss([
        className,
        isRandom && p.teamsId && generateRandomStyle(Number(p.teamsId)),
      ])}
      onClick={() => {
        typeof p.onClick === "function" && p.onClick();
      }}
    >
      {p.children}
      {p.teamsName ? (
        <div className="text-avatar">{getFirstText(p.teamsName)}</div>
      ) : (
        // <Popover
        //   trigger="click"
        //   content={<img src={avatarUrl} />}
        //   title={one.name}
        // >
        <CacheImage src={p.avatarUrl} className="img-avatar" />
        // </Popover>
      )}
    </div>
  );
};

export { Avatar };
