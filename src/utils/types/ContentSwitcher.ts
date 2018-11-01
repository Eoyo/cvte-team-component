export type ContentSwitcher<T extends string> = {
  [x in T]: JSX.Element | null | string
};
