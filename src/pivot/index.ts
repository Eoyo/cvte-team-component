import { Actor } from "../stores/Actor/actor";
import { route } from "../view/common/route/Router";
import { readRoute } from "../utils/Route/readRoute";
import { showContactInfo, showTeamInfo } from "../view/content/Contact/utils";

export type AppContent = "meeting" | "contact";

class AppState {
  routes: string[] = [];
  currentContent: AppContent = "meeting";
  lastContactRoute: string[] = ["contact"];
  lastMeetingRoute: string[] = ["meeting"];
  sign: ["read"?] = [];
}

const routeReader = readRoute({
  contact: [
    {
      friends: [
        {
          showContactInfo,
        },
      ],
      teams: [
        {
          showTeamInfo,
        },
      ],
    },
  ],
});

// 设置路由
// 通过Actor的思路提供强大的路由控制.
export const AppPivot = Actor(new AppState())({
  writeRoutes: {
    routes: [] as string[],
  },
  readRoutes: {
    routes: [] as string[],
  },
  changeContent: {
    content: "" as AppContent,
  },
})({
  writeRoutes: (s, a) => {
    return {
      routes: a.routes,
    };
  },
  readRoutes: (s, a) => {
    routeReader(a.routes);
    let content = a.routes[0] as AppContent;
    const rus = {
      routes: a.routes,
      currentContent: content,
    };

    if (content === "contact") {
      return {
        ...rus,
        lastContactRoute: [...rus.routes],
      };
    } else if (content === "meeting") {
      return {
        ...rus,
        lastMeetingRoute: [...rus.routes],
      };
    } else {
      return rus;
    }
  },

  changeContent: (s, a) => {
    let newRoute = s.routes;

    if (a.content !== s.currentContent) {
      if (a.content === "contact") {
        newRoute = [...s.lastContactRoute];
      } else {
        newRoute = [...s.lastMeetingRoute];
      }
    }
    return {
      currentContent: a.content,
      routes: newRoute,
    };
  },
});

// bind the route to Actor. AppPivot will control the whole App;
route.bindActor(AppPivot);
