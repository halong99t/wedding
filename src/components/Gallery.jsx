import { useEffect, useRef, useState } from "react";
import CONFIG from "../config.js";
import { Heart } from "../lib/icons.jsx";
import { SectionHead } from "./common.jsx";

/* Hướng bay vào của từng ảnh (lặp theo chu kỳ) và độ nghiêng khi nằm yên — cố định để mỗi lần xem giống nhau */
const FLY = [
  { dx: "-70px", dy: "50px", spin: "-12deg" },
  { dx: "0px", dy: "100px", spin: "7deg" },
  { dx: "70px", dy: "50px", spin: "12deg" },
  { dx: "-50px", dy: "-60px", spin: "9deg" },
  { dx: "60px", dy: "-50px", spin: "-8deg" },
  { dx: "0px", dy: "80px", spin: "-6deg" },
];
const TILT = ["-2.2deg", "1.6deg", "-1.1deg", "2.3deg", "-1.7deg", "1.2deg", "-2.4deg", "1.9deg", "-1.4deg", "2.1deg"];

/* 4. Album + lightbox */
export function Gallery() {
  const { gallery, galleryVisible } = CONFIG;
  const n = galleryVisible || 6;
  const [open, setOpen] = useState(false);
  const photos = gallery.filter((g) => g.src); // chỉ ảnh thật mới phóng to / chuyển được
  const [idx, setIdx] = useState(null); // vị trí ảnh đang phóng to trong photos, null = đóng
  const lb = idx === null ? null : photos[idx];
  const dlg = useRef(null);
  const swipe = useRef(null); // toạ độ X lúc chạm để nhận vuốt ngang

  const step = (d) => setIdx((i) => (i === null ? i : (i + d + photos.length) % photos.length));

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (lb) {
      if (d.showModal) {
        if (!d.open) d.showModal();
        document.body.classList.add("lb-open"); // khoá cuộn trang phía sau
      } else {
        window.open(lb.src, "_blank");
        setIdx(null);
      }
    } else {
      if (d.open) d.close();
      document.body.classList.remove("lb-open");
    }
    return () => document.body.classList.remove("lb-open");
  }, [lb]);

  function onKey(e) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  }
  function onPointerDown(e) {
    swipe.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e) {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }

  return (
    <section id="gallery">
      <SectionHead title="Album ảnh cưới" />
      <div className={"album rv" + (open ? " open" : "")}>
        {gallery.map((g, i) => {
          const f = FLY[i % FLY.length];
          return (
            <figure
              key={i}
              className={g.wide ? "wide" : undefined}
              data-more={i >= n ? "" : undefined}
              style={{ "--i": i, "--dx": f.dx, "--dy": f.dy, "--spin": f.spin, "--tilt": TILT[i % TILT.length] }}
            >
              <div className={"pic" + (g.src ? "" : " ph")} data-ph={g.cap || "Ảnh"}>
                {g.src && <img src={g.src} alt={g.cap || ""} loading="lazy" />}
              </div>
              {g.cap && <figcaption>{g.cap}</figcaption>}
              {/* tim bay ra khỏi ảnh khi rê chuột */}
              <i className="fh" aria-hidden="true"><Heart /></i>
              <i className="fh" aria-hidden="true"><Heart /></i>
              <i className="fh" aria-hidden="true"><Heart /></i>
              {g.src && (
                <button type="button" aria-label={"Xem ảnh " + (g.cap || "")} onClick={() => setIdx(photos.indexOf(g))} />
              )}
            </figure>
          );
        })}
      </div>
      {gallery.length > n && (
        <button className="btn-text" id="moreBtn" type="button" onClick={() => setOpen((o) => !o)}>
          {open ? "Thu gọn" : "Xem thêm ảnh"}
        </button>
      )}

      <dialog
        className="lightbox"
        ref={dlg}
        aria-label="Ảnh phóng to"
        onClose={() => setIdx(null)}
        onClick={(e) => {
          if (e.target === dlg.current) setIdx(null);
        }}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <button className="close" type="button" aria-label="Đóng" onClick={() => setIdx(null)}>
          ×
        </button>
        {photos.length > 1 && (
          <>
            <button className="nav prev" type="button" aria-label="Ảnh trước" onClick={() => step(-1)}>
              <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="nav next" type="button" aria-label="Ảnh sau" onClick={() => step(1)}>
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <p className="counter" aria-live="polite">
              {idx === null ? "" : idx + 1 + " / " + photos.length}
              {lb && lb.cap ? <span> · {lb.cap}</span> : null}
            </p>
          </>
        )}
        {/* key theo idx để animation hiện ảnh chạy lại mỗi lần chuyển */}
        {lb && <img key={idx} src={lb.src} alt={lb.cap || ""} />}
      </dialog>
    </section>
  );
}
