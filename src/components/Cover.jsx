import { useEffect, useState } from "react";
import CONFIG from "../config.js";
import { heroDate, lunarOf, pad } from "../lib/date.js";
import { Heart } from "../lib/icons.jsx";

const UNITS = [
  ["Ngày", 864e5],
  ["Giờ", 36e5],
  ["Phút", 6e4],
  ["Giây", 1e3],
];

function Countdown({ iso }) {
  const target = new Date(iso).getTime();
  const [vals, setVals] = useState(null);

  useEffect(() => {
    if (isNaN(target)) return;
    const tick = () => {
      let d = target - Date.now();
      if (d <= 0) {
        setVals("done");
        return true;
      }
      setVals(
        UNITS.map((u) => {
          const v = Math.floor(d / u[1]);
          d -= v * u[1];
          return pad(v);
        })
      );
      return false;
    };
    if (tick()) return;
    const iv = setInterval(() => {
      if (tick()) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [target]);

  if (isNaN(target)) return null;
  if (vals === "done")
    return (
      <div className="count" role="timer" aria-live="off">
        <p className="ct-done">Hôn lễ đã diễn ra ♥</p>
      </div>
    );
  return (
    <div className="count" role="timer" aria-live="off">
      {UNITS.map((u, i) => (
        <div className="ct" key={u[0]}>
          <b>{vals ? vals[i] : "00"}</b>
          <span>{u[0]}</span>
        </div>
      ))}
    </div>
  );
}

/* Trang bìa (chỉ PC) — dính bên trái, nội dung cuộn bên phải */
export function Cover({ guest }) {
  const { groom, bride, party, heroPhoto } = CONFIG;
  const alt = groom.name + " & " + bride.name;
  return (
    <aside className={"cover" + (heroPhoto ? " has-photo" : "")} aria-label="Trang bìa thiệp">
      <div className={"cover-photo" + (heroPhoto ? "" : " ph")} data-ph="Ảnh cưới chính" aria-hidden="true">
        {heroPhoto && <img src={heroPhoto} alt={alt} />}
      </div>
      <div className="cover-veil" aria-hidden="true" />
      <div className="cover-frame" aria-hidden="true">
        <i />
      </div>
      <div className="cover-body">
        <p className="save">Save the Date</p>
        <p className="cnames">
          <span>{groom.name}</span>
          <span className="camp" aria-hidden="true">
            &amp;
          </span>
          <span>{bride.name}</span>
        </p>
        <p className="cdate">{heroDate(party)}</p>
        <p className="clunar">{lunarOf(party)}</p>
        <div className="orn" aria-hidden="true">
          <Heart />
        </div>
        <Countdown iso={party} />
        <p className="cto">
          Kính gửi: <b>{guest}</b>
        </p>
      </div>
      <nav className="cnav" aria-label="Các mục trong thiệp">
        <a href="#couple">Cặp đôi</a>
        <a href="#gallery">Album</a>
        <a href="#party">Tiệc cưới</a>
        <a href="#rsvp">Xác nhận</a>
        <a href="#gift">Mừng cưới</a>
      </nav>
    </aside>
  );
}
