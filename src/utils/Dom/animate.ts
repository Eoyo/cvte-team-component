// derived by by Dan Pupius www.pupius.net
export class Bezier {
  st: number;
  ed: number;
  spd: number; // speed time,
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  ts: number;
  df: number;
  isEnd: boolean = true;
  constructor(
    st: number,
    ed: number,
    spd?: number,
    p1?: number,
    p2?: number,
    p3?: number,
    p4?: number
  ) {
    this.st = st;
    this.ed = ed;
    this.spd = spd || 1000;

    this.p1 = p1 || 0;
    this.p2 = p2 || 1;
    this.p3 = p3 || 0;
    this.p4 = p4 || 1;

    this.ts = Date.now();
    this.df = ed - st;
  }
  B2(t: number) {
    return 3 * (1 - t) * (1 - t) * t;
  }
  B3(t: number) {
    return 3 * (1 - t) * t * t;
  }
  B4(t: number) {
    return t * t * t;
  }
  getPos() {
    return (Date.now() - this.ts) / this.spd;
  }
  getNow() {
    var pc = (Date.now() - this.ts) / this.spd;
    var bz = this.B2(pc) + this.B3(pc) + this.B4(pc);
    if (pc >= 1) {
      this.isEnd = true;
    }
    if (pc >= 0.5 && this.df * bz < 1) {
      this.isEnd = true;
      return this.ed;
    }
    return pc >= 1 ? this.ed : (this.st + this.df * bz) | 0;
  }
  update(ed?: number, st?: number, spd?: number) {
    if (st === undefined) {
      this.st = this.getNow();
    } else {
      this.st = st;
    }

    if (ed === undefined) {
      this.ed = this.ed;
    } else {
      this.ed = ed;
    }
    this.spd = spd || this.spd;
    this.ts = Date.now();
    this.df = this.ed - this.st;
    return this;
  }

  onRunning = (current: number) => {};
  onEnd? = (current: number) => {};
  runBezier = () => {
    if (this.isEnd) {
      this.onEnd && this.onEnd(this.ed);
      return;
    }
    requestAnimationFrame(this.runBezier);
    this.isEnd = false;
    const current = this.getNow();
    this.onRunning(current);
  };
  animate(running: (current: number) => void, end?: (current: number) => void) {
    this.onRunning = running;
    this.onEnd = end;

    // 如果停止了就启动animate
    if (this.isEnd) {
      this.isEnd = false;
      requestAnimationFrame(this.runBezier);
    }
  }
}
