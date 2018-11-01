import { appData } from "./appData";
import { redux } from "../utils/redux";
interface appSet {
  <T extends keyof typeof appData>(prop: T, value: (typeof appData)[T]): void;
  <T extends keyof typeof appData>(
    prop: T,
    func: (value: (typeof appData)[T]) => (typeof appData)[T]
  ): void;
}
interface appGet {
  <T extends keyof typeof appData>(prop: T): (typeof appData)[T];
  (): typeof appData;
}
export const app = {
  get: <appGet>((prop: any) => {
    if (prop === undefined) {
      return appData;
    } else {
      return appData[prop];
    }
  }),
  set: <appSet>((prop: any, value: any) => {
    if (typeof value === "function") {
      const newValue = value(appData[prop]);
      appData[prop] = newValue;
    } else {
      appData[prop] = value;
    }
  }),
};

const App = redux.Ac(
  {
    name: "string",
  },
  {
    bee: {
      nice: "",
    },
  },
  {
    bee(s, b) {
      return s;
    },
  }
);

// let p = { name: "", url: "" };
// App.grab(s => {
//   p.name = s.name;
//   p.url = s.name;
// });

// App.subscribe(s => {
//   console.log(p);
// });
// App.subscribe(({ name }) => {
//   console.log(name);
// });

// App.merge({
//   name: "liumiao",
// });

// // deleteHock();
// App.merge({
//   name: "XXXXX",
// });
/**
app usage

//get
cosnt person = app.get('username');
const { person } = app.get();

// set
app.set('username', d => 'fawfea');
app.set('username', 'LiuMiao');
app.set("person", p => {
  p.id = "";
  return p;
})
*/
