import { LeakClick } from "./LeackClick";

function BlotGet<T>(func: () => T): () => T {
  return () => {
    const octopus = func();
    Blot.octopus.push(octopus);
    return octopus;
  };
}

export const Blot = {
  octopus: [] as any[],
  LeakClick: BlotGet(LeakClick),
};

/**
 * octopus , 🐙章鱼模式,
 * 使用非纯净的 触手函数
 */
