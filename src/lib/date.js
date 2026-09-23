import { lunarText } from "./lunar.js";

export const pad = (n) => String(n).padStart(2, "0");
export const WD = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

/* đọc ngày theo giờ VN để không lệch múi giờ máy khách */
export function vnParts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso || "");
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return { y: +m[1], mo: +m[2], d: +m[3], h: m[4], mi: m[5], wd: d.getDay(), date: d };
}

/* "12 . 10 . 2026" */
export function heroDate(iso) {
  const p = vnParts(iso);
  return p ? pad(p.d) + " . " + pad(p.mo) + " . " + p.y : "";
}

/* "12.10.2026" */
export function shortDate(iso) {
  const p = vnParts(iso);
  return p ? pad(p.d) + "." + pad(p.mo) + "." + p.y : "";
}

export function lunarOf(iso) {
  const p = vnParts(iso);
  return p ? lunarText(p.date) : "";
}
