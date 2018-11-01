import { connect, Provider } from "react-redux";
import * as React from "react";
import { Store } from "redux";
import { withRouter } from "react-router-dom";
export function FusionPro<T, R, ownProps>(
  store: Store<T>,
  mapper: (state: T, ownProps?: ownProps) => R,
  App: (props: R & ownProps) => JSX.Element
) {
  const FusionContainer = withRouter(connect(mapper)(App) as any);
  return function FusionStoreProvider(p: ownProps) {
    return (
      <Provider store={store}>
        <FusionContainer {...p} />
      </Provider>
    );
  };
}
