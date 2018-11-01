/**
 * 涉及到html的展示, 需要有安全方面的考虑.
 * 主要用于文本编辑器的文本展示对的
 */
import * as React from "react";
import "./ContentViewer.scss";
export type ContentViewerProps = {
  htmlStr: string;
  noPlaceholder?: boolean;
  type: "dangerous" | "text";
};
export const ContentViewer: React.SFC<ContentViewerProps> = p => {
  let placeholder = p.noPlaceholder ? "" : "未填写内容";
  return (
    <div className="meeting-card-editor content-viewer">
      {p.type === "dangerous" && (
        <div
          dangerouslySetInnerHTML={{
            __html: p.htmlStr || `<p style="color: #b2b2b2">${placeholder}</p>`,
          }}
          className={"editor-style"}
        />
      )}
      {p.type === "text" && (
        <div className="meeting-card-editor-detail-status">
          {p.htmlStr ? (
            <pre>{p.htmlStr}</pre>
          ) : (
            <span className="no-content">{placeholder}</span>
          )}
        </div>
      )}
    </div>
  );
};
