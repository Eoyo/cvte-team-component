import * as React from "react";
export const PersonHead = (p: { url: string }) => {
  return (
    <div className="person-head">
      <img src={p.url} alt="头像" />
    </div>
  );
};
