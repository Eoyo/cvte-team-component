/**
 * 文件的计数器.
 */
import * as React from "react";
import "./Counter.scss";
export type CounterProps = {
  num: any;
  sum?: number;
  noWrap?: boolean;
};
export const Counter: React.SFC<CounterProps> = p => {
  return (
    <div className="counter">
      {!p.noWrap && <span className="counter-right">(</span>}
      <span className="counter-number">
        {p.sum !== undefined ? p.num + "/" + p.sum : p.num}
      </span>
      {!p.noWrap && <span className="counter-right">)</span>}
    </div>
  );
};
