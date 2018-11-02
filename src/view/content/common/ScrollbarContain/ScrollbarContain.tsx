import * as React from "react";
import _ from "lodash";
import { arrCss } from "../../../../utils/export";
let elementResizeDetector = require("element-resize-detector");
type NiceScrollConfig = Partial<{
  // style
  zindex: "auto" | number;
  background: string;
  cursorcolor: string;
  cursorwidth: string;
  cursorborder: string;
  cursorminheight: number;
  cursorfixedheight: false | string | number; // false, 设置固定的高度
  cursorborderradius: string;
  cursoropacitymin: number;
  cursoropacitymax: number;
  railoffset: boolean | number;
  railhoffset: boolean | number;
  railpadding: Partial<{
    top: number;
    right: number;
    left: number;
    bottom: number;
  }>;
  railWidth: number;
  railalign: "right" | "left";
  railvalign: "bottom" | "top";
  disableoutline: boolean;
  enabletranslate3d: boolean;

  // scroll , zoom
  smoothscroll: boolean;
  scrollspeed: number; // 40
  preservenativescrolling: boolean; // true
  horizrailenabled: boolean; // horizontal scroll
  mousescrollstep: number; // scrolling speed with mouse wheel (pixel)
  // touchbehavior: boolean; // deprecated
  emulatetouch: boolean; // enable cursor-drag scrolling like touch devices in desktop computer
  grabcursorenabled: boolean; // while emulate touch;
  hwacceleration: boolean; // hardware // use hardware accelerated scroll when supported
  bouncescroll: boolean; // 弹性的滚动
  sensitiverail: boolean; // click to scroll;

  // zoom
  // usetransition: boolean; // ?
  boxzoom: boolean; // enable zoom
  dblclickzoom: boolean;
  gesturezoom: boolean; // use pinch out/in

  // interaction
  autohidemode: boolean | "cursor" | "leave" | "hidden" | "scroll";
  iframeautoresize: boolean;
  spacebarenabled: boolean; // 空格翻页的能力.
  enablekeyboard: boolean; // true
  enablemousewheel: boolean; // true
  enablemouselockapi: boolean; //true,  锁定鼠标进入游览模式
  directionlockdeadzone: number; // 6, pixel
  //      cursormaxheight:boolean,
  hidecursordelay: number; // 400 , time
  nativeparentscrolling: boolean; // true , 控制scroll事件是否向上触发, 子scroll完了, 父再继续scroll;
  enablescrollonselection: boolean; // true , 选择文本自动滚动.
  cursordragspeed: number; // 0.3 , 选择文本时的滚动速度
  overflowx: boolean; // true
  overflowy: boolean; // true
  rtlmode: string; // cursor 的初时位置
  cursordragontouch: boolean; // false
  oneaxismousemode: string; //auto,  单一滚动轴时. 可以使用wheel滚动.
  scriptpath: string; // ‘’,  boxmode icon ??
  preventmultitouchscrolling: boolean; // true, 阻止了多点触控的滚动.
  disablemutationobserver: boolean; // false,
  enableobserver: boolean; // true, observe 的 content div;
  scrollbarid: boolean | string; // flase , set an id for scroll bar;
}>;
export const JqueryNiceScroll = (
  obj: any
): JQuery<any> & {
  niceScroll: (opt: NiceScrollConfig) => any;
  getNiceScroll: any;
} => {
  return $(obj) as any;
};

export const ScrollbarContainConfig = {
  cursorcolor: "#B2B2B2",
  cursoropacitymin: 0,
  cursoropacitymax: 0.6,
  autohidemode: true,
  cursorwidth: "6px",
  cursorborder: "none",
  cursorborderradius: "3px",
  horizrailenabled: false,
  preventmultitouchscrolling: false,
  preservenativescrolling: true,
  cursorminheight: 100,
  spacebarenabled: false,
  enabletranslate3d: true,
  railpadding: {
    right: 1,
  },
};

export class ScrollbarContain extends React.Component<{
  className?: string;
  scrollContentRef?: (ele: HTMLElement | null) => any;
  niceScrollConfig?: NiceScrollConfig;
}> {
  container: Element | null;
  scrollContent: Element | null;
  detector: {
    listenTo: (ele: Element, func: () => void) => void;
    removeAllListeners(ele: Element): any;
  };
  setContainer = (ele: Element | null) => {
    this.container = ele;
  };
  setScroll() {
    // nice scroll has style bug;
    JqueryNiceScroll(this.scrollContent).niceScroll(
      Object.assign(
        {},
        ScrollbarContainConfig,
        this.props.niceScrollConfig || {}
      )
    );
  }
  componentDidMount() {
    this.detector = elementResizeDetector();
    console.log("listento", this.container);
    if (this.container) {
      this.detector.listenTo(this.container, () => {
        this.isEntered && setTimeout(this.resize, 0);
      });
      $(this.container).on("mouseenter", () => {
        //鼠标进入增加联系人栏，才会弹出滚动条
        if (!this.isEntered) {
          this.isEntered = true;
          this.setScroll();
          JqueryNiceScroll(this.scrollContent)
            .getNiceScroll()
            .resize();
        } else {
          this.resize();
        }
      });
    }
  }
  componentWillUnmount() {
    if (this.container) {
      this.detector.removeAllListeners(this.container);
    }
  }
  resize = _.debounce(() => {
    const content = this.scrollContent;

    // content 的大小改变时触发scroll
    JqueryNiceScroll(content)
      .trigger("scroll")
      .getNiceScroll()
      .resize();
  }, 200);

  isEntered = false;

  render() {
    return (
      <div
        ref={ele => {
          if (ele) {
            this.scrollContent = ele;
            this.props.scrollContentRef && this.props.scrollContentRef(ele);
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          overflowY: "hidden",
        }}
        className={arrCss(["scrollbar-base", this.props.className])}
      >
        <div
          className="scroll-content"
          ref={this.setContainer}
          style={{
            overflow: "hidden",
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
