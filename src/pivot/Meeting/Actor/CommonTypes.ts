// 0 : static; 1 : loading; 2: success; 3: message ;4: error;
export type loadingCode = 0 | 1 | 2 | 3 | 4;

export type Can<T extends string> = { [x in T]: boolean };

export type refElement = HTMLElement | null;
