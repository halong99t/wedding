import { useEffect, useRef, useState } from "react";
import CONFIG from "../config.js";
import { Copy, HEART_PATH } from "../lib/icons.jsx";
import { shortDate } from "../lib/date.js";
import { SectionHead } from "./common.jsx";

function Gift({ g, index }) {
  const [copied, setCopied] = useState("");
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(g.number);
      setCopied("Đã sao chép số tài khoản");
    } catch (err) {
      setCopied("Số tài khoản: " + g.number);
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2500);
  }

  return (
    <div className="gift">
      <p className="role">{g.role}</p>
      <div className="qr">
        {g.qr ? <img src={g.qr} alt={"Mã QR " + g.role} /> : "Ảnh QR · assets/qr-" + (index + 1) + ".png"}
      </div>
      <p className="bank">{g.bank}</p>
      <p className="holder">{g.holder}</p>
      <button className="num" type="button" aria-label="Sao chép số tài khoản" onClick={copy}>
        {g.number}
        <Copy />
      </button>
      <p className="copied" aria-live="polite">
        {copied}
      </p>
    </div>
  );
}

/* 9. Hộp mừng cưới */
export function Gifts() {
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
  }

  return (
    <section id="gift">
      <SectionHead title="Hộp mừng cưới" heart={false} />
      <button
        className="giftbox rv"
        type="button"
        aria-expanded={open}
        aria-controls="giftList"
        onClick={toggle}
      >
        <span className="box">
          <svg viewBox="2 3.5 20 18" aria-hidden="true">
            <path fill="#B01E24" d={HEART_PATH} />
          </svg>
          <span className="xi" aria-hidden="true">
            囍
          </span>
        </span>
        <span className="open-lbl">{open ? "Đóng hộp" : "Mở hộp"}</span>
      </button>
      <div className={"gifts" + (open ? " open" : "")} id="giftList" ref={listRef}>
        {CONFIG.gifts.map((g, i) => (
          <Gift key={i} g={g} index={i} />
        ))}
      </div>
    </section>
  );
}

/* 10. Cảm ơn */
export function Thanks() {
  const { groom, bride, party } = CONFIG;
  return (
    <section className="thanks">
      <p className="script rv">Thank you</p>
      <p className="rv">
        Sự hiện diện của Quý khách
        <br />
        là món quà quý giá nhất đối với Gia đình chúng tôi!
      </p>
      <p className="sign rv">
        {groom.name}  ·  {bride.name}  ·  {shortDate(party)}
      </p>
    </section>
  );
}

