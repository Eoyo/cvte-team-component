import * as React from "react";
export const DirIcon = (p: { open: boolean }) => {
  return (
    <div className="dir-btn">
      {p.open ? (
        <i className="teams-icon icon-extend" />
      ) : (
        <i className="teams-icon icon-shrink" />
      )}
    </div>
  );
};
