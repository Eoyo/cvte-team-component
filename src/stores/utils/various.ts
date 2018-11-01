function newState(s: any) {
  if (Array.isArray(s)) {
    return [...s];
  } else if (typeof s === "object") {
    return { ...s };
  } else {
    return s;
  }
}
export function Various<T extends object>(s: T) {
  const nS = newState(s);
  Object.getOwnPropertyNames(s).forEach(d => {
    nS[d] = newState(s[d]);
  });
  return (rf: (s: T) => void) => {
    rf(nS);
    return nS;
  };
}
