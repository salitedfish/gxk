import { ObjectType } from "../../../type";
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 将时间格式字符串或时间戳转化为时间戳毫秒
 * @param timeStr 如：2010年1月1号 10时2分4或1234567891
 * @returns
 */
export const useGenTimeStamp = (timeStr: string | number) => {
  if (!isNaN(Number(timeStr))) {
    /**如果是"1234567891"或1234567891 */
    if (String(timeStr).length === 10) {
      return Number(timeStr) * 1000;
    } else if (String(timeStr).length === 13) {
      return Number(timeStr);
    } else {
      throw new Error("useGenTimeStamp：时间戳错误");
    }
  } else {
    /**如果是"2010年1月1号 10时2分4 */
    const timeStrFormat = String(timeStr)
      .replace(/-|年|月|日|号/g, "/")
      .replace(/时|分|秒/g, ":");
    return Number(new Date(timeStrFormat));
  }
};
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 判断目标时间是否比参照时间早
 * @param targetTime 目标时间戳或时间格式字符串，如果是字符串要求从年开始。
 * @param referenceTime 参照时间戳或时间格式字符串，默认为当前时间戳毫秒，如果是字符串要求从年开始。
 * @returns
 */
export const useIsEarly = (targetTime: number | string, referenceTime: number | string = Date.now()) => {
  return useGenTimeStamp(targetTime) < useGenTimeStamp(referenceTime);
};
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 剩余时间转化为时间格式字符串
 * @param time 剩余时间毫秒
 * @format 格式化格式，默认为"{dd}天{hh}时{mm}分{ss}秒"
 * @returns
 */
export const useCountDownFormat = (time: number | string, format: string = "{dd}天{hh}时{mm}分{ss}秒"): string => {
  let newTime = Number(time);
  /**解析时间 */
  const date: ObjectType<number> = {
    "d+": Math.floor(newTime / 1000 / 3600 / 24),
    "h+": Math.floor((newTime % (1000 * 3600 * 24)) / 1000 / 3600),
    "m+": Math.floor((newTime % (1000 * 60 * 60)) / 1000 / 60),
    "s+": Math.floor((newTime % (1000 * 60)) / 1000),
  };
  /**替换格式化字符串 */
  for (const key in date) {
    const reg = new RegExp("({" + key + "})");
    if (reg.test(format)) {
      const regRes = reg.exec(format) || [];
      const replaceValue = regRes[0].length == 3 ? date[key] : date[key].toString().padStart(2, "0");
      format = format.replace(regRes[0], String(replaceValue));
    }
  }
  return format;
};
/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/**
 * 时间戳或时间格式字符串转化为时间格式字符串
 * @param time 时间戳或时间格式字符串，如果是字符串要求从年开始
 * @param format 格式化格式，默认为"{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}"
 */
export const useTimeFormat = (time: number | string, format: string = "{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}"): string => {
  let newTime = useGenTimeStamp(time);
  const targetDate = new Date(newTime);
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
  if (/({y+})/i.test(format)) {
    const reg = /({y+})/i;
    const regRes = reg.exec(format) || [];
    const replaceValue = fullYear.toString().slice(6 - regRes[0].length);
    format = format.replace(regRes[0], replaceValue);
  }
  for (const key in date) {
    const reg = new RegExp("({" + key + "})");
    if (reg.test(format)) {
      const regRes = reg.exec(format) || [];
      const replaceValue = regRes[0].length == 3 ? date[key] : date[key].toString().padStart(2, "0");
      format = format.replace(regRes[0], replaceValue);
    }
  }
  return format;
};