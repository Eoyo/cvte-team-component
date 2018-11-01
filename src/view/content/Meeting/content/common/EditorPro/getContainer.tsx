export function getContainer(parent: string) {
  return (ele: HTMLElement | null) => {
    if (ele) {
      return $(ele).closest(parent)[0];
    } else {
      return ele;
    }
  };
}

export const pageContent = getContainer(".page-content");
export const scrollContent = getContainer(".scrollbar-base");
