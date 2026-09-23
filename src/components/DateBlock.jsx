import { vnParts, pad, WD, lunarOf } from "../lib/date.js";

export function DateBlock({ iso, className = "" }) {
  const p = vnParts(iso);
  if (!p) return null;
  return (
    <div className={("date-block " + className).trim()}>
      <div className="t">{p.h}:{p.mi}</div>
      <div className="wd">{WD[p.wd]}</div>
      <div className="dd">{pad(p.d)}</div>
      <div className="mo">Tháng {p.mo}</div>
      <div className="yy">{p.y}</div>
    </div>
  );
}

export function Lunar({ iso, className = "" }) {
  return <p className={className}>{lunarOf(iso)}</p>;
}

/* Lịch tháng, Thứ Hai đứng đầu, ngày cưới được đánh dấu */
export function Calendar({ iso }) {
  const p = vnParts(iso);
  if (!p) return null;
  const first = new Date(p.y, p.mo - 1, 1);
  const days = new Date(p.y, p.mo, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(<span key={"e" + i} />);
  for (let d = 1; d <= days; d++) {
    cells.push(
      d === p.d ? (
        <span key={d} className="mark" aria-label="Ngày cưới">
          {d}
        </span>
      ) : (
        <span key={d}>{d}</span>
      )
    );
  }
  return (
    <div className="calendar">
      <div className="cap">Tháng {p.mo} / {p.y}</div>
      <div className="grid">
        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map((w) => (
          <span key={w} className="wd">
            {w}
          </span>
        ))}
        {cells}
      </div>
    </div>
  );
}
