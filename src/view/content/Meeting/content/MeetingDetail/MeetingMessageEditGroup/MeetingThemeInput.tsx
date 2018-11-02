import * as React from "react";
import { InputWrapper } from "../../../../../common/component/InputLike/InputWrapper";
import { RequireWithText } from "../../../../../common/ts-styled/Decorate/Require";
import { Ele } from "../../../../../common/ts-styled/ele";
import {
  MeetingConnect,
  Meeting,
} from "../../../../../../pivot/Meeting/Actor/MeetingActor";
// import { Fusion } from "src/stores/Actor/fusion";
// import { Actor } from "src/stores/Actor/actor";
// import { time } from "src/utils/export";
// const testInput = Actor({
//   input: "",
// })({
//   setInput: {
//     value: "",
//   },
// })({
//   *setInput(s, a) {
//     yield { input: a.value };
//   },
// });

// let OutStr = "";
// const TestInpit = Fusion(testInput.getStore())(s => {
//   console.log(OutStr === s.input, OutStr, s.input);
//   return {
//     input: s.input,
//     onChange(str) {
//       OutStr = str;
//       testInput.setInput({
//         value: str,
//       });
//     },
//   };
// })(p => {
//   return (
//     <Ele.input
//       onInput={ev => {
//         console.log(ev);
//         p.onChange(ev.currentTarget.value);
//       }}
//       maxLength={16}
//       placeholder="请输入会议主题"
//       className="one-date-input teams-input"
//       value={p.input + ""}
//     />
//   );
// });

export const C_MeetingThemeInput = MeetingConnect(s => {
  console.log(s.editingDetail.subject);
  return {
    onInputTheme(str: string) {
      Meeting.setMeetingBaseMessage({
        name: str,
      });
    },
    name: s.editingDetail.subject,
  };
})(p => (
  <InputWrapper
    leftDecorator={<RequireWithText hintText="*" toCheckText={p.name} />}
  >
    主题
    <Ele.input
      spellCheck={false}
      onChange={ev => {
        p.onInputTheme(ev.currentTarget.value);
      }}
      innerRef={ele => {
        if (ele) {
          // console.log("set themeInput", p.name);
          if (p.name !== ele.value) {
            ele.value = p.name;
          }
        }
      }}
      maxLength={30}
      placeholder="请输入会议主题"
      className="one-date-input teams-input"
    />
  </InputWrapper>
));

// export class TestInput extends React.Component {
//   state = {
//     input: "",
//   };
//   updateInput(str) {
//     setTimeout(() => {
//       this.setState({
//         input: str,
//       });
//     }, 0);
//   }

//   render() {
//     return (
//       <Ele.input
//         onInput={ev => {
//           this.updateInput(ev.currentTarget.value);
//         }}
//         maxLength={16}
//         placeholder="请输入会议主题"
//         className="one-date-input teams-input"
//         value={this.state.input}
//       />
//     );
//   }
// }
