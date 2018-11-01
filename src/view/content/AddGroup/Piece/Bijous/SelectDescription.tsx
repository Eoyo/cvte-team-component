import * as React from "react";

const AddOffset = ({
  adding,
}: {
  adding: number;
}) => {
  let addstr = "";
  if (adding > 0) {
    addstr = "+" + adding;
  } else if (adding === 0) {
    addstr = "";
  } else if (adding < 0) {
    addstr = "" + adding;
  } else {
    addstr = "";
  }
  return (
    <div className="adding-offset">{addstr}</div>
  );
};

export class SelectDescription extends React.Component<{
  sum: number;
  adding: number;
}> {
  render() {
    const p = this.props;
    return (
      <div className="select-description">
        <div
          className={
            p.adding === 0
              ? "adding none"
              : "adding some"
          }
        >
          <AddOffset adding={p.adding} />
        </div>
        已选
        <span className="select-highlight-description">
          {p.sum}
        </span>
        人
      </div>
    );
  }
}
