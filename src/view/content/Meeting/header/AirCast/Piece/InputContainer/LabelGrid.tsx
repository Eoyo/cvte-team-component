import * as React from "react";
import "./LabelGrid.scss";
// 方格
export const labelArray = (
  len: number,
  forID: string,
  codeString: string = ""
) => {
  const gridStyleRule = (index: number) => {
    return codeString.length === index
      ? // (codeString.length === 0 && index === 0)
        "pincode-text-grid active"
      : "pincode-text-grid";
  };
  /* 生成对应数据 */
  const Labels: number[] = [];
  for (let i = 0; i < len; i++) {
    Labels.push(i);
  }
  return (
    <div
      className="pincode-code"
      onTouchEnd={ev => {
        ev.stopPropagation();
      }}
    >
      {Labels.map((index: number) => {
        let code = codeString[index] || "";
        if (code >= "a" && code <= "z") {
          code = code.toUpperCase();
        }
        return (
          <div key={index} className={gridStyleRule(index)}>
            {code}
          </div>
        );
      })}
    </div>
  );
};
