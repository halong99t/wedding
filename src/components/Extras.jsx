import { useMemo } from "react";
import { Heart, Music as MusicIcon } from "../lib/icons.jsx";
import { reducedMotion } from "../lib/store.js";

/* Tim rơi — vị trí ngẫu nhiên tính một lần */
export function Hearts({ count = 10 }) {
  const items = useMemo(() => {
    if (reducedMotion()) return [];
    return Array.from({ length: count }, () => ({
      left: (Math.random() * 100).toFixed(1) + "%",
      size: (9 + Math.random() * 9).toFixed(0) + "px",
      opacity: (0.22 + Math.random() * 0.33).toFixed(2),
      animationDuration: (9 + Math.random() * 9).toFixed(1) + "s",
      animationDelay: (-Math.random() * 18).toFixed(1) + "s",
    }));
  }, [count]);

  return (
    <div className="hearts" aria-hidden="true">
      {items.map((s, i) => (
        <i
          key={i}
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: s.animationDuration,
            animationDelay: s.animationDelay,
          }}
        >
          <Heart />
        </i>
      ))}
    </div>
  );
}

/* Mưa tim chúc mừng ngay sau khi mở thiệp — rơi nhanh, đậm hơn tim nền, tự gỡ sau vài giây */
export function Confetti({ count = 26 }) {
  const items = useMemo(() => {
    if (reducedMotion()) return [];
    return Array.from({ length: count }, (_, i) => ({
      left: (Math.random() * 100).toFixed(1) + "%",
      size: (10 + Math.random() * 14).toFixed(0) + "px",
      hue: i % 3, // ba sắc đỏ khác nhau
      animationDuration: (2.2 + Math.random() * 1.6).toFixed(2) + "s",
      animationDelay: (Math.random() * 1.2).toFixed(2) + "s",
      rot: (Math.random() * 360).toFixed(0) + "deg",
    }));
  }, [count]);

  return (
    <div className="confetti" aria-hidden="true">
      {items.map((s, i) => (
        <i
          key={i}
          className={"c" + s.hue}
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: s.animationDuration,
            animationDelay: s.animationDelay,
            "--rot": s.rot,
          }}
        >
          <Heart />
        </i>
      ))}
    </div>
  );
}

/* Nút nhạc + gợi ý + thẻ audio */
export function MusicControl({ music }) {
  const { audioRef, enabled, playing, hint, toggle } = music;
  return (
    <>
      {enabled && (
        <button
          className={"music" + (playing ? " on" : "")}
          type="button"
          aria-label={playing ? "Tắt nhạc" : "Phát nhạc"}
          onClick={toggle}
        >
          <MusicIcon />
        </button>
      )}
      {enabled && hint && <div className="music-hint">Click vào đây nếu bạn muốn phát nhạc</div>}
      {/* preload="auto" để nhạc sẵn sàng phát ngay lúc chạm mở phong bì */}
      {music.src && <audio ref={audioRef} src={music.src} preload="auto" loop />}
    </>
  );
}
