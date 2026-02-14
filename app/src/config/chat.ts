// 随便聊聊 - 开放时间（中国时间 20:00-23:59）与时长配置

const TZ = "Asia/Shanghai";

/** 中国时区当前小时 0-23 */
function getChinaHour(): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const p = parts.find((x) => x.type === "hour");
  return p ? parseInt(p.value, 10) : 0;
}

/** 当前是否在中国时间 20:00-23:59 之间（含 20:00，不含 0:00） */
export function isChatOpen(): boolean {
  const hour = getChinaHour();
  return hour >= 20 && hour <= 23;
}

/** 距离下次开放（今晚或明晚 20:00 中国时间）的毫秒数；若当前在开放时段则返回 0 */
export function getMsUntilOpen(): number {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [h, m] = fmt.format(new Date()).split(":").map((x) => parseInt(x, 10));
  const minutesNow = h * 60 + m;
  const openAt = 20 * 60;
  const closeAt = 24 * 60;
  if (minutesNow >= openAt && minutesNow < closeAt) return 0;
  const nextOpenMinutes = minutesNow < openAt ? openAt - minutesNow : 24 * 60 - minutesNow + openAt;
  return nextOpenMinutes * 60 * 1000;
}

/** 默认单次聊天时长（秒）。后续可扩展：按等级加成、每日首次加倍等 */
export const CHAT_DURATION_SEC = 5 * 60;

/** 花币延长时长（秒） */
export const CHAT_EXTEND_SEC = 2 * 60;

/** 延长一次消耗毒硬币。后续可扩展：首次延长便宜、多次递增等 */
export const CHAT_EXTEND_COST = 3;
