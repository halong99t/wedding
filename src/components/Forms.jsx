import { useEffect, useRef, useState } from "react";
import CONFIG from "../config.js";
import { store } from "../lib/store.js";
import { SectionHead } from "./common.jsx";

/* Gọi API lưu chung trên Netlify (netlify/functions/guestbook.mjs).
   Trả về JSON; ném lỗi nếu API không có (vd. chạy `npm run dev` không qua netlify dev). */
async function api(method, payload, query = "") {
  if (!CONFIG.api) throw new Error("no api");
  const res = await fetch(CONFIG.api + query, {
    method,
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error("api unavailable");
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || res.statusText);
  return data;
}

/* 7. Xác nhận tham dự */
export function Rsvp() {
  const [name, setName] = useState("");
  const [come, setCome] = useState("yes");
  const [count, setCount] = useState("");
  const [msg, setMsg] = useState({ cls: "formmsg", text: "" });
  const [busy, setBusy] = useState(false);
  const [local, setLocal] = useState(!CONFIG.api); // true = chỉ lưu trên máy
  const nameRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    const n = name.trim();
    if (!n) {
      setMsg({ cls: "formmsg err", text: "Bạn cho chúng mình biết tên nhé." });
      nameRef.current?.focus();
      return;
    }
    const payload = {
      type: "rsvp",
      fullName: n,
      willCome: come === "yes" ? "Có" : "Không",
      numberOfPeople: count || "",
      page: window.location.href,
    };
    setBusy(true);
    setMsg({ cls: "formmsg", text: "Đang gửi…" });
    try {
      await api("POST", payload);
    } catch (err) {
      /* API không có (chạy thử máy) → lưu tại máy; API có mà lỗi → báo lỗi */
      if (err.message === "no api" || err.message === "api unavailable") {
        const list = store.get("thiep-rsvp") || [];
        list.push({ ...payload, at: new Date().toISOString() });
        store.set("thiep-rsvp", list);
        setLocal(true);
      } else {
        setMsg({ cls: "formmsg err", text: "Gửi chưa được, bạn thử lại sau ít phút nhé." });
        setBusy(false);
        return;
      }
    }
    setMsg({
      cls: "formmsg ok",
      text:
        payload.willCome === "Có"
          ? "Cảm ơn " + n + "! Hẹn gặp bạn ở tiệc cưới ♥"
          : "Cảm ơn " + n + " đã báo lại. Hẹn bạn dịp khác nhé ♥",
    });
    setName("");
    setCount("");
    setCome("yes");
    setBusy(false);
  }

  return (
    <section className="rsvp" id="rsvp">
      <SectionHead title="Xác nhận tham dự" />
      <p className="center rv" style={{ margin: 0, fontSize: ".95rem" }}>
        Vui lòng xác nhận sự có mặt của bạn trước ngày <b>{CONFIG.rsvpDeadline}</b>
        <br />
        để chúng mình chuẩn bị tiếp đón một cách chu đáo nhất.
        <br />
        Trân trọng!
      </p>
      <form className="form rv" noValidate onSubmit={onSubmit}>
        <div className="field">
          <label className="vh" htmlFor="r-name">
            Tên bạn
          </label>
          <input
            id="r-name"
            ref={nameRef}
            type="text"
            placeholder="Tên bạn"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="radios" role="radiogroup" aria-label="Bạn có đến không?">
          <label>
            <input type="radio" name="willCome" value="yes" checked={come === "yes"} onChange={() => setCome("yes")} />
            Có! Tôi sẽ đến
          </label>
          <label>
            <input type="radio" name="willCome" value="no" checked={come === "no"} onChange={() => setCome("no")} />
            Xin lỗi! Tôi bận mất rồi
          </label>
        </div>
        <div className="field">
          <label className="vh" htmlFor="r-count">
            Số người tham dự
          </label>
          <input
            id="r-count"
            type="number"
            min="0"
            max="20"
            placeholder="Số người tham dự"
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy}>
          Xác nhận
        </button>
        <p className={msg.cls} role="status" aria-live="polite">
          {msg.text}
        </p>
        {local && (
          <p className="note">
            <i>Bản xem thử — phản hồi chỉ lưu trên máy này.</i>
          </p>
        )}
      </form>
    </section>
  );
}

/* Danh sách dự phòng khi không có API: lời chúc lưu tại máy + lời chúc mẫu trong config */
function localWishes() {
  const local = store.get("thiep-wishes") || [];
  return local.slice().reverse().concat(CONFIG.wishes || []);
}

/* 8. Lưu bút */
export function Wishes() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [msg, setMsg] = useState({ cls: "formmsg", text: "" });
  const [busy, setBusy] = useState(false);
  const [all, setAll] = useState(() => (CONFIG.api ? CONFIG.wishes || [] : localWishes()));
  const [online, setOnline] = useState(!!CONFIG.api);
  const STEP = 5; // số lời chúc hiện ban đầu và mỗi lần "Xem thêm"
  const [visible, setVisible] = useState(STEP);
  const nameRef = useRef(null);
  const msgRef = useRef(null);

  /* tải danh sách chung từ server */
  useEffect(() => {
    if (!CONFIG.api) return;
    let dead = false;
    api("GET", null, "?type=wish")
      .then((d) => {
        if (!dead) setAll(d.items.concat(CONFIG.wishes || []));
      })
      .catch(() => {
        if (!dead) {
          setOnline(false);
          setAll(localWishes());
        }
      });
    return () => {
      dead = true;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const n = name.trim(), t = text.trim();
    if (!n || !t) {
      setMsg({ cls: "formmsg err", text: "Điền tên và lời chúc giúp chúng mình nhé." });
      (n ? msgRef : nameRef).current?.focus();
      return;
    }
    const payload = { type: "wish", name: n, text: t };
    setBusy(true);
    setMsg({ cls: "formmsg", text: "Đang gửi…" });
    try {
      if (online) {
        const d = await api("POST", payload);
        setAll((cur) => [d.item, ...cur]);
      } else {
        const item = { ...payload, at: new Date().toISOString() };
        const list = store.get("thiep-wishes") || [];
        list.push(item);
        store.set("thiep-wishes", list);
        setAll(localWishes());
      }
      setName("");
      setText("");
      setMsg({ cls: "formmsg ok", text: "Đã nhận lời chúc của " + n + " ♥" });
    } catch (err) {
      setMsg({ cls: "formmsg err", text: "Gửi chưa được, bạn thử lại sau ít phút nhé." });
    }
    setBusy(false);
  }

  return (
    <section>
      <SectionHead title="Lưu bút" />
      <form className="form rv" noValidate onSubmit={onSubmit}>
        <div className="field wine">
          <label className="vh" htmlFor="w-name">
            Tên bạn
          </label>
          <input
            id="w-name"
            ref={nameRef}
            type="text"
            placeholder="Tên bạn"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field wine">
          <label className="vh" htmlFor="w-msg">
            Lời chúc
          </label>
          <textarea
            id="w-msg"
            ref={msgRef}
            placeholder="Lời chúc"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy}>
          Gửi lời chúc
        </button>
        <p className={msg.cls} role="status" aria-live="polite">
          {msg.text}
        </p>
      </form>
      <p className="wishes-intro rv">
        {all.length
          ? "Cảm ơn mọi người rất nhiều vì đã gửi những lời chúc mừng tốt đẹp nhất đến đám cưới của hai vợ chồng ạ ♥"
          : "Hãy là người đầu tiên gửi lời chúc đến hai vợ chồng ♥"}
      </p>
      <div className="wishes">
        {all.slice(0, visible).map((w, i) => (
          <div className="wish" key={(w.at || "") + i}>
            <span className="av" aria-hidden="true">
              {String(w.name).trim().charAt(0).toUpperCase() || "♥"}
            </span>
            <div>
              <b>{w.name}</b>
              <p>{w.text}</p>
              {w.at && <time dateTime={w.at}>{new Date(w.at).toLocaleDateString("vi-VN")}</time>}
            </div>
          </div>
        ))}
      </div>
      {all.length > visible && (
        <button className="btn-text" type="button" onClick={() => setVisible((v) => v + STEP)}>
          Xem thêm lời chúc ({all.length - visible})
        </button>
      )}
      {all.length > STEP && visible >= all.length && (
        <button className="btn-text" type="button" onClick={() => setVisible(STEP)}>
          Thu gọn
        </button>
      )}
    </section>
  );
}
