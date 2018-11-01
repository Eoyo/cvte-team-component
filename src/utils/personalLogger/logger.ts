type logType = "error" | "warn" | "log";
type logPool = {
  type: logType;
  log: any[];
}[];
const closure = {
  focusName: "all", // 'all' 是所有人
  personalLogPool: {} as {
    [x: string]: logPool;
  },
};

export class Logger {
  name: string;
  signature: string;
  private logPool: logPool = [];
  private add(log: any[], type: logType) {
    if (this.logPool.length > 1000) {
      console.warn(
        this.signature,
        "Too Much Log!! Can't Stop??"
      );
      return false;
    }
    this.logPool.push({
      type,
      log: log,
    });
    return true;
  }
  constructor(registName: string) {
    this.name = registName;
    this.signature = "@" + this.name;
    if (closure.personalLogPool[this.name]) {
      console.error(
        this.name,
        " has been registed"
      );
    } else {
      closure.personalLogPool[this.name] = [];
    }
    this.logPool =
      closure.personalLogPool[this.name];
  }
  log(...d: any[]) {
    this.add(d, "log");
    if (Jax.check(this.name)) {
      console.log(this.signature, ...d);
    }
  }
  warn(...d: any[]) {
    this.add(d, "warn");
    if (Jax.check(this.name)) {
      console.warn(this.signature, ...d);
    }
  }
  error(...d: any[]) {
    this.add(d, "error");
    if (Jax.check(this.name)) {
      console.log(this.signature);
      console.error(this.signature, ...d);
    }
  }
}

// Jax 用于控制所有的Logger;
export const Jax = {
  focus(name: string) {
    closure.focusName = name;
    const pool = closure.personalLogPool[name];
    if (pool) {
      console.clear();
      pool.forEach(d => {
        console[d.type](...d.log);
      });
      return true;
    } else {
      console.clear();
      console.log(
        "Sorry... Who is " + name + "?",
        "(Jax don't know)"
      );
      return false;
    }
  },
  check(name: string) {
    if (closure.focusName === "all") {
      return true;
    } else if (closure.focusName === name) {
      return true;
    } else {
      return false;
    }
  },
  autoFocus() {
    window.onunload = () => {
      localStorage.setItem(
        "JaxFocus",
        closure.focusName
      );
    };
    const localName = localStorage.getItem(
      "JaxFocus"
    );
    if (localName) {
      closure.focusName = localName;
    } else {
      closure.focusName = "all";
    }
    console.log(
      "@Jax",
      "auto set focus name as " +
        closure.focusName
    );
  },
};

export const lium = new Logger("VastykoLiu");
export const zeyu = new Logger("ZeYu");
export const xutao = new Logger("XuTao");
