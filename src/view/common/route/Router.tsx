/**
 * Router,
 * 路由输入框组件, 显示或同步路由的路径
 */
const route = {
  loaded: false,
  triggerRouteChange: () => {},
  setTrigger(trigger: (path: string[]) => void) {
    route.triggerRouteChange = () => {
      trigger(route.getRoute());
    };
    if (route.loaded) {
      route.triggerRouteChange();
    }
  },
  setRoute(path: string[]) {
    const a = path.filter(s => !!s);
    window.location.hash = "/" + a.join("/");
  },
  getRoute() {
    let hashStr = window.location.hash;
    const arr = hashStr.split("#");
    if (arr.length > 1) {
      let str = arr.pop() || "";
      // str[0] === ''; the first route is str[1];
      return str.split("/").filter(s => !!s);
    } else {
      return [];
    }
  },

  // @!! use ActorRus<> instead
  bindActor(actor: { readRoutes: (ac: { routes: string[] }) => any }) {
    route.setTrigger(path => {
      actor.readRoutes({
        routes: path,
      });
    });

    // @ts-ignore;
    actor.subscribe(s => {
      route.setRoute(s.routes);
    });
  },
};

window.addEventListener("load", () => {
  route.loaded = true;
  if (route.triggerRouteChange) {
    route.triggerRouteChange();
  }
});

window.addEventListener("hashchange", () => {
  route.triggerRouteChange();
});

export { route };
