import { UseDebounce, UseThrottling, UseTimesClick, UsePromiseQueue, ObjectType } from "../type";
import { useCheckUndefined } from "./dataOperate";

/**
 * 通过文件地址点击下载
 * @param url
 * @param name
 */
export const useDownloadByURL = (url: string, name = "file") => {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

/**
 * 从URL中获取文件名、文件名.扩展名
 * @param URL
 * @param withExt true表示携带扩展名
 * @returns
 */
export const useFileNameFromURL = (URL: string, withExt = false) => {
  const firstIndex = URL.lastIndexOf("/") + 1;
  const lastIndex = URL.lastIndexOf(".");
  if (withExt) {
    return URL.slice(firstIndex);
  } else {
    return URL.slice(firstIndex, lastIndex);
  }
};

/**
 * 组装url参数
 * @param url
 * @param params
 * @returns
 */
export const useGenParamsUrl = (
  url: string,
  params: { [key: string]: string | number } = {}
): string => {
  if (useCheckUndefined(url, params)) {
    throw new Error("url or params is undefined");
  }
  let resUrl: string;
  if (url[url.length - 1] === "?") {
    resUrl = url;
  } else {
    resUrl = url + "?";
  }
  if (params) {
    for (const key in params) {
      resUrl = `${resUrl}${key}=${params[key]}&`;
    }
  }
  return resUrl.slice(0, resUrl.length - 1);
};

/**
 * 防抖Hook
 * @param callBack
 * @param countDown
 * @returns
 */
export const useDebounce: UseDebounce = (callBack, countDown = 1000) => {
  let timer: NodeJS.Timeout;
  return (...params) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callBack(...params);
      clearTimeout(timer);
    }, countDown);
  };
};

/**
 * 节流Hook
 * @param callBack
 * @param countDown
 * @returns
 */
export const useThrottling: UseThrottling = (callBack, countDown = 1000) => {
  let lock = false;
  return (...params) => {
    if (!lock) {
      lock = true;
      setTimeout(() => {
        callBack(...params);
        lock = false;
      }, countDown);
    }
  };
};

/**
 * 多次点击Hook,支持节流
 * @param callBack
 * @param option 可选参数times默认两次，持续500ms,间隔0秒
 * @returns
 */
export const useTimesClick: UseTimesClick = (callBack, option) => {
  let times = 0;
  let lock = false;
  let timer: NodeJS.Timeout;
  let op = {
    ...{
      times: 2,
      countDown: 500,
      interval: 0,
    },
    ...option,
  };
  return (...params) => {
    if (!lock) {
      if (!timer) {
        timer = setTimeout(() => {
          times = 0;
          clearTimeout(timer);
        }, op.countDown);
      }
      times = times + 1;
      if (times === op.times) {
        callBack(...params);
        lock = true;
        setTimeout(() => {
          lock = false;
        }, op.interval);
      }
    }
  };
};

/**
 * promise返回结果后，如果成功则返回，否则继续执行，直到最终满足条件
 * @param asyncCallBack
 * @param params
 * @param isCondition 判断是否满足条件的函数，返回true表示满足
 * @param options count countDown 最大请求次数 请求返回后间隔多少时间请求一次
 * @returns
 */
export const usePromiseQueue: UsePromiseQueue = (asyncCallBack, isCondition, params, options) => {
  const resOptions = { count: 3, countDown: 500, ...options };
  let count = 0;
  return new Promise((resolve, reject) => {
    const handler = async () => {
      count = count + 1;
      try {
        const result = await asyncCallBack(params);
        if (isCondition(result)) {
          /**满足条件返回 */
          resolve(result);
        } else if (count > resOptions.count) {
          /**超出最大次数返回reject */
          reject("Exceeded times");
        } else {
          /**否则继续请求 */
          setTimeout(handler, resOptions.countDown);
        }
      } catch (error) {
        reject(error);
      }
    };
    setTimeout(handler, resOptions.countDown);
  });
};

/**
 * 倒计时格式化
 * @param time 单位为毫秒
 * @returns
 */
export const useCountDownFormat = (time: number, format: string): string => {
  /**解析时间 */
  const date: ObjectType = {
    "d+": Math.floor(time / 1000 / 3600 / 24),
    "h+": Math.floor((time % (1000 * 3600 * 24)) / 1000 / 3600),
    "m+": Math.floor((time % (1000 * 60 * 60)) / 1000 / 60),
    "s+": Math.floor((time % (1000 * 60)) / 1000),
  };
  for (const key in date) {
    const reg = new RegExp("(" + key + ")");
    if (reg.test(format)) {
      const regRes = reg.exec(format) || [];
      const replaceValue =
        regRes[0].length == 1 ? date[key] : date[key].toString().padStart(2, "0");
      format = format.replace(regRes[0], replaceValue);
    }
  }
  return format;
};

/**
 * 时间戳格式化
 * @param time 单位为毫秒
 * @param format DDDD-MM-DD HH:mm:ss
 */
export const useTimeFormat = (time: number, format: string): string => {
  const targetDate = new Date(time);
  /**解析时间 */
  const date: ObjectType = {
    "M+": targetDate.getMonth() + 1,
    "d+": targetDate.getDate(),
    "h+": targetDate.getHours(),
    "m+": targetDate.getMinutes(),
    "s+": targetDate.getSeconds(),
    "q+": Math.floor((targetDate.getMonth() + 3) / 3),
    "S+": targetDate.getMilliseconds(),
  };
  const fullYear = targetDate.getFullYear();

  /**替换格式化字符串,年和其他分开替换 */
  if (/(y+)/i.test(format)) {
    const reg = /(y+)/i;
    const regRes = reg.exec(format) || [];
    const replaceValue = fullYear.toString().slice(4 - regRes[0].length);
    format = format.replace(regRes[0], replaceValue);
  }
  for (const key in date) {
    const reg = new RegExp("(" + key + ")");
    if (reg.test(format)) {
      const regRes = reg.exec(format) || [];
      const replaceValue =
        regRes[0].length == 1 ? date[key] : date[key].toString().padStart(2, "0");
      format = format.replace(regRes[0], replaceValue);
    }
  }
  return format;
};

/**
 * 判断目标时间是否比当前时间早
 * @param target
 * @param curTime
 * @returns
 */
export const useIsEarly = (target: number, curTime: number = Date.now()) => {
  return target < curTime;
};
