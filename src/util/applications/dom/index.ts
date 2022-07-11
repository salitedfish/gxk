/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 设置页面的title
 * @param title
 */
export const useSetHTMLTitle = (title: string): void => {
  const titleDom = window.document.getElementsByTagName("title")[0];
  titleDom.innerText = title;
};
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 获取目标dom
 * @param target
 * @returns
 */
export const useGetDom = (target: string) => {
  let targetDom: NodeListOf<HTMLElement> = document.querySelectorAll(target);
  return targetDom;
};
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 添加目标dom的class
 * @param target id、class、tag需要带前缀#、.
 * @param classNames 类名数组
 * @returns
 */
export function useAddDomClass(target: string): (classNames: string[]) => void;
export function useAddDomClass(target: string, classNames: string[]): void;
export function useAddDomClass(target: string, classNames?: string[]) {
  const handler = (classNames: string[]) => {
    let targetDom: NodeListOf<HTMLElement> = useGetDom(target);
    for (let i = 0; i <= targetDom.length - 1; i++) {
      targetDom[i].classList.add(...classNames);
    }
  };
  /**柯里化判断 */
  if (classNames === undefined) {
    return (classNames: string[]) => {
      handler(classNames);
    };
  } else {
    handler(classNames);
  }
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 移除目标dom的class
 * @param target id、class、tag需要带前缀#、.
 * @param classNames 类名数组
 * @returns
 */
export function useRemoveDomClass(target: string): (classNames: string[]) => void;
export function useRemoveDomClass(target: string, classNames: string[]): void;
export function useRemoveDomClass(target: string, classNames?: string[]) {
  const handler = (classNames: string[]) => {
    let targetDom: NodeListOf<HTMLElement> = useGetDom(target);
    for (let i = 0; i <= targetDom.length - 1; i++) {
      targetDom[i].classList.remove(...classNames);
    }
  };
  /**柯里化判断 */
  if (classNames === undefined) {
    return (classNames: string[]) => {
      handler(classNames);
    };
  } else {
    handler(classNames);
  }
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
type GetStyleName = keyof CSSStyleDeclaration & string;
/**
 * 获取dom的style各属性值
 * @param target
 * @param styleName 如：width
 * @returns
 */
export function useGetDomStyle(target: string): (styleName: GetStyleName) => string[];
export function useGetDomStyle(target: string, styleName: GetStyleName): string[];
export function useGetDomStyle(target: string, styleName?: GetStyleName) {
  const handler = (styleName: GetStyleName) => {
    let targetDom: NodeListOf<HTMLElement> = useGetDom(target);
    const styles = [];
    for (let i = 0; i <= targetDom.length - 1; i++) {
      /**dom.style只能获取到内联style的属性值，所以用这种方式获取 */
      styles.push(window.getComputedStyle(targetDom[i]).getPropertyValue(styleName));
    }
    return styles;
  };
  /**柯里化判断 */
  if (styleName === undefined) {
    return (styleName: GetStyleName) => {
      return handler(styleName);
    };
  } else {
    return handler(styleName);
  }
}
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
type SetStyleName = keyof CSSStyleDeclaration & string;
/**
 * 设置dom的style各属性值
 * @param target
 * @param styleName 如：width
 * @param styleValue 如：12px
 */
export function useSetDomStyle(target: string): <T extends SetStyleName>(styleName: T) => (styleValue: CSSStyleDeclaration[T]) => void;
export function useSetDomStyle<T extends SetStyleName>(target: string, styleName: T): (styleValue: CSSStyleDeclaration[T]) => void;
export function useSetDomStyle<T extends SetStyleName>(target: string, styleName: T, styleValue: CSSStyleDeclaration[T]): void;
export function useSetDomStyle<T extends SetStyleName>(target: string, styleName?: T, styleValue?: CSSStyleDeclaration[T]) {
  const handler = (styleName: T) => {
    return (styleValue: CSSStyleDeclaration[T]) => {
      let targetDom: NodeListOf<HTMLElement> = useGetDom(target);
      for (let i = 0; i <= targetDom.length - 1; i++) {
        targetDom[i].style[styleName] = styleValue;
      }
    };
  };
  /**柯里化判断 */
  if (styleName === undefined && styleValue === undefined) {
    return handler;
  } else if (styleValue === undefined && styleName) {
    return handler(styleName);
  } else if (styleName && styleValue) {
    handler(styleName)(styleValue);
  }
}