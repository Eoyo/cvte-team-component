export const isMobile = (value: string) => {
  return /(^1[3|4|5|6|7|8|9][0-9]{9}$)|(^\\+[0-9]{1,3}[0-9]{7,11}$)/.test(
    value
  );
};

export const getQueryVariable = (
  variable: string
) => {
  const query = window.location.search.substring(
    1
  );
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return "";
};

export const isEmail = (value: string) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  );
};
