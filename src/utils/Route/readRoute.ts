type RouteConfig = {
  [x: string]:
    | (((routeNode: string) => void) | RouteConfig)[]
    | ((str: string) => void);
};

export function readRoute(op: RouteConfig) {
  return (route: string[]) => {
    // 遍历执行路由树
    function readOneRoute(config: RouteConfig, routeIndex: number) {
      let routeValue = route[routeIndex];
      let matchRouteNode = config[routeValue];
      if (routeValue !== undefined) {
        if (Array.isArray(matchRouteNode)) {
          // 启动路由相应函数or向下匹配路由
          matchRouteNode.forEach(routeConf => {
            if (typeof routeConf === "function") {
              routeConf(routeValue);
            } else {
              readOneRoute(routeConf, routeIndex + 1);
            }
          });
        } else {
          // 执行函数节点来匹配路由
          Object.getOwnPropertyNames(config).forEach(oneFuncRouteName => {
            let func = config[oneFuncRouteName];
            if (typeof func === "function") {
              func(routeValue);
            }
          });
        }
      }
    }
    readOneRoute(op, 0);
  };
}
