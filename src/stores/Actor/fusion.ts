import { Store } from "redux";
import { connect, Provider } from "react-redux";
import * as React from "react";

export function Fusion<S>(store: Store<S>) {
  return function Mapper<Props>(mapper: (state: S, ownProps?: any) => Props) {
    return function ProvideApp<ownProps = {}>(
      App: (p: Props & ownProps) => JSX.Element | null
    ) {
      const Connected = connect(mapper)(App);
      return (p: ownProps) =>
        // Ele  为react.createElement;
        React.createElement(
          Provider,
          {
            store,
          },
          React.createElement(Connected, p as any)
        );
    };
  };
}
