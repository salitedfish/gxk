/**
 * 检查参数中是否有undefined
 * @param argument
 * @returns
 */
export const useCheckUndefined = (...argument: any[]): boolean => {
  return argument.includes(undefined);
};

/**
 * 深拷贝,这里函数不考虑，map、set等没考虑到
 * @param oldData
 * @returns
 */
export const useDeepClone = <T>(oldData: T): T => {
  if (useCheckUndefined(oldData)) {
    throw new Error("oldData is undefined");
  }
  if (oldData === null) {
    return oldData;
  } else if (Array.isArray(oldData)) {
    const newData: any = [];
    for (const item of oldData) {
      newData.push(useDeepClone(item));
    }
    return newData;
  } else if (typeof oldData === "object") {
    const newData: any = {};
    for (const key in oldData) {
      newData[key] = useDeepClone(oldData[key]);
    }
    return newData;
  } else {
    const newData = oldData;
    return newData;
  }
};

/**
 * 深度比较两个数据是否相同
 * @param origin 例如: {a: 1}
 * @param target 例如: {a: 1}
 * @returns
 */
export const useDeepCompare = (origin: any, target: any): boolean => {
  if (["string", "number"].includes(typeof origin) || ["string", "number"].includes(typeof target) || [origin, target].includes(null)) {
    return origin === target;
  } else {
    /**false优先，只要有不同就return false */
    if (Array.isArray(origin) && Array.isArray(target)) {
      if (origin.length !== target.length) {
        return false;
      } else {
        for (let i = 0; i < origin.length; i++) {
          if (!useDeepCompare(origin[i], target[i])) {
            return false;
          }
        }
        return true;
      }
    } else if (typeof origin === "object" && typeof target === "object") {
      for (const key in origin) {
        if (!useDeepCompare(origin[key], target[key])) {
          return false;
        }
      }
      return true;
    } else {
      return origin === target;
    }
  }
};

/**
 * 深度判断数组中是否包含某个值
 * @param origin 例如[{a:1}]
 * @param target 例如 {a:1}
 * @returns
 */
export const useDeepInclude = (origin: unknown[], target: unknown): boolean | number => {
  if (useCheckUndefined(origin, target)) {
    throw new Error("origin or target is undefined");
  }
  if (["string", "number"].includes(typeof target) || target === null) {
    return origin.includes(target);
  } else {
    for (const item of origin) {
      if (useDeepCompare(item, target)) {
        return true;
      }
    }
    return false;
  }
};

/**
 * 深度数组去重，不改变原数组
 * @param oldArr
 * @returns
 */
export const useDeepRmDuplication = <V>(oldArr: V[]): V[] => {
  const newArr: V[] = [];
  for (const item of oldArr) {
    if (!useDeepInclude(newArr, item)) {
      newArr.push(item);
    }
  }
  return newArr;
};

type Position = "pre" | "center" | "next" | "between";
/**
 * 根据提供的位置替换字符串
 * @param target
 * @param position
 * @param count 如果是两个值,第二个值表示从后面开始计数
 * @param replaceStr
 */
export function useHidPartString(target: string, position: "center" | "between", count: [number, number], replaceStr?: string): string;
export function useHidPartString(target: string, position: "pre" | "next", count: [number], replaceStr?: string): string;
export function useHidPartString(target: string, position: Position, count: number[], replaceStr: string = "*"): string {
  if (position === "pre" || position === "next") {
    /**二段 */
    const preStr = target.slice(0, count[0]);
    const nextStr = target.slice(count[0]);
    if (position === "pre") {
      return preStr.replace(/./g, replaceStr) + nextStr;
    } else if (position === "next") {
      return preStr + nextStr.replace(/./g, replaceStr);
    }
  } else if (position === "center" || position === "between") {
    /**三段 */
    const preStr = target.slice(0, count[0]);
    const centerStr = target.slice(count[0], -count[1]);
    const nextStr = target.slice(-count[1]);
    if (position === "center") {
      return preStr + centerStr.replace(/./g, replaceStr) + nextStr;
    } else if (position === "between") {
      return preStr.replace(/./g, replaceStr) + centerStr + nextStr.replace(/./g, replaceStr);
    }
  }
  return target;
}