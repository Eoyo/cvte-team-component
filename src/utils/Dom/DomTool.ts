/**
 * 判断target 是否是ele[]中的或ele的子元素
 * @param ele
 * @param target
 */
export function eleContain(
  ele: HTMLElement[],
  target: HTMLElement
) {
  for (const onep of ele) {
    if (
      onep === target ||
      $.contains(onep, target)
    ) {
      return true;
    }
  }
  return false;
}
