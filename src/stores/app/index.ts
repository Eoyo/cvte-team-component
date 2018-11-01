import { redux } from "../utils/redux";
import { SioTypes } from "./indexType";
const initState: SioTypes.stateTypes = {
  personList: [],
  name: "",
};
const sio = redux.Ac(initState, {}, {});

const { name } = sio.grab();

const jack = name + "@@";

console.log(jack);
