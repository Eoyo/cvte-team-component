import { TypeAirCast } from "../AirCastState";
import { Act } from "../../../../../../stores/Actor/actor";

export const airCastInputActor = Act<TypeAirCast>()({
  changePinCode: {
    code: "",
  },
})({
  changePinCode(s, d) {
    return {
      ...s,
      pincode: d.code,
    };
  },
});
