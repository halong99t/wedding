import { useEffect, useRef, useState } from "react";
import CONFIG from "../config.js";
import { heroDate } from "../lib/date.js";
import { Heart } from "../lib/icons.jsx";
import { reducedMotion } from "../lib/store.js";

/* 14 tim bung ra từ con dấu: góc, quãng bay, cỡ, thời lượng — cố định để mỗi lần mở giống nhau */
const BURST = Array.from({ length: 14 }, (_, i) => ({
  a: Math.round((360 / 14) * i + (i % 2 ? 9 : -9)),
  d: 110 + (i % 3) * 38,
  s: 10 + (i % 4) * 3,
  t: 0.9 + (i % 3) * 0.15,
}));

/* Cổng mở thiệp — phong bì.
   phase: "closed" → "opening" (nắp lật) → "hiding" (mờ dần) → onDone() */
export function Gate({ guest, onOpen, onHide, onDone }) {
  const { groom, bride, party } = CONFIG;
  const [phase, setPhase] = useState("closed");
  const envRef = useRef(null);
  const opened = useRef(false);

  useEffect(() => {
    envRef.current?.focus({ preventScroll: true });
  }, []);

  function open() {
    if (opened.current) return;
    opened.current = true;
    setPhase("opening");
    onOpen?.();
    const reduce = reducedMotion();
    /* dấu bung (0–.5s) → nắp lật (.3–1.2s) → thư bay lên (.8–2s) → phông zoom mờ (2.1–3s) */
    const t1 = reduce ? 50 : 2100, t2 = reduce ? 100 : 3050;
    /* t1: phông bắt đầu mờ — báo App cho thiệp phía sau hiện dần ngay lúc này để chuyển cảnh liền mạch */
    setTimeout(() => {
      setPhase("hiding");
      onHide?.();
    }, t1);
    setTimeout(() => onDone?.(), t2);
  }

  function onKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  }

  return (
    <div
      className={"gate" + (phase === "hiding" ? " hide" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Mở thiệp cưới"
      onKeyDown={onKey}
    >
      <div className="gate-inner">
        <p className="kicker">Thư mời cưới</p>
        <p className="gnames">
          <span>{groom.name}</span> &amp; <span>{bride.name}</span>
        </p>
        <button
          className={"env" + (phase !== "closed" ? " open" : "")}
          ref={envRef}
          type="button"
          aria-label="Chạm để mở thiệp"
          onClick={open}
        >
          <span className="env-back" />
          <span className="env-letter">
            <span className="l-kicker">Trân trọng kính mời</span>
            <span className="l-names">
              <span>{groom.name}</span> &amp; <span>{bride.name}</span>
            </span>
            <span className="l-date">{heroDate(party)}</span>
            <span className="l-heart" aria-hidden="true">
              <Heart />
            </span>
          </span>
          <span className="env-pocket" />
          <span className="env-flap" />
          <span className="env-seal" aria-hidden="true">
            囍
          </span>
          {/* tim bung ra từ con dấu lúc mở */}
          <span className="burst" aria-hidden="true">
            {BURST.map((b, i) => (
              <i key={i} style={{ "--a": b.a + "deg", "--d": b.d + "px", "--s": b.s + "px", "--t": b.t + "s" }}>
                <Heart />
              </i>
            ))}
          </span>
        </button>
        <p className="gto">
          Kính gửi: <b>{guest}</b>
        </p>
        <p className="tap">Chạm vào phong bì để mở thiệp</p>
      </div>
    </div>
  );
}
