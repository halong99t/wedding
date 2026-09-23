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
  const [lb, setLb] = useState(null); // ảnh đang phóng to
  const dlg = useRef(null);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (lb) {
      if (d.showModal) {
        if (!d.open) d.showModal();
        document.body.classList.add("lb-open"); // khoá cuộn trang phía sau
      } else {
        window.open(lb.src, "_blank");
        setLb(null);
      }
    } else {
      if (d.open) d.close();
      document.body.classList.remove("lb-open");
    }
    return () => document.body.classList.remove("lb-open");
  }, [lb]);

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
                <button type="button" aria-label={"Xem ảnh " + (g.cap || "")} onClick={() => setLb(g)} />
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
        onClose={() => setLb(null)}
        onClick={(e) => {
          if (e.target === dlg.current) setLb(null);
        }}
      >
        <button className="close" type="button" aria-label="Đóng" onClick={() => setLb(null)}>
          ×
        </button>
        <img src={lb ? lb.src : ""} alt={lb ? lb.cap || "" : ""} />
      </dialog>
    </section>
  );
}
