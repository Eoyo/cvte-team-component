/**
 * Icon,
 */
import * as React from "react";
import "./Iconsvg.scss";

export type IconsvgProps = {
  className?: string;
  type?: "circle" | "square";
  active?: boolean;
  url: string;
  proxy?: React.HTMLAttributes<HTMLDivElement>;
  onClick?: Function;
};

const config = {
  getDirDefalut(url: string) {
    return `url(./assets/images/${url}default.svg)`;
  },
  getDirAvtive(url: string) {
    return `url(./assets/images/${url}active.svg)`;
  },
  getNormal(url: string) {
    return `url(./assets/images/${url})`;
  },
};
// sfc
/**
 *
 * @param p.url , 使用‘/’ 结尾表示使用active, default 双状态文件
 */
export const Iconsvg: React.SFC<IconsvgProps> = p => {
  const iconType = p.type || "circle";

  const isDir = p.url[p.url.length - 1] === "/";

  //
  return (
    <div
      onClick={() => {
        typeof p.onClick === "function" && p.onClick();
      }}
      style={{
        backgroundImage: isDir
          ? p.active
            ? config.getDirAvtive(p.url)
            : config.getDirDefalut(p.url)
          : config.getNormal(p.url),
      }}
      className={
        p.className
          ? p.className + " icon-svg " + iconType
          : "icon-svg " + iconType
      }
      {...(isDir
        ? {
            onMouseEnter(ev) {
              console.log(ev);
              !p.active &&
                $(ev.currentTarget).css({
                  backgroundImage: config.getDirAvtive(p.url),
                });
            },
            onMouseLeave(ev) {
              !p.active &&
                $(ev.currentTarget).css({
                  backgroundImage: config.getDirDefalut(p.url),
                });
            },
          }
        : {})}
      {...(p.proxy ? p.proxy : {})}
    />
  );
};
