import { useCallback, useEffect, useRef, useState } from "react";

/* Nhạc nền.
   - Thử tự phát ngay khi tải trang (trình duyệt cho phép nếu khách đã hay nghe media ở trang này).
   - Bị chặn thì phát ở cử chỉ đầu tiên: chạm mở phong bì, hoặc bất kỳ chạm/phím nào.
   - File không tải được (chưa bỏ vào public/assets) → missing=true, nút nhạc tự ẩn. */
export function useMusic(src) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [hint, setHint] = useState(false);
  const hintTimer = useRef(0);
  const enabled = !!src && !missing;

  const showHint = useCallback(() => {
    setHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(false), 7000);
  }, []);

  /* thử phát; trả về true nếu được */
  const tryPlay = useCallback(async () => {
    const a = audioRef.current;
    if (!src || !a || a.error) return false;
    try {
      await a.play();
      setPlaying(true);
      setHint(false);
      return true;
    } catch (e) {
      return false;
    }
  }, [src]);

  /* gọi khi khách chạm mở phong bì */
  const play = useCallback(async () => {
    if (!(await tryPlay()) && enabled) showHint();
  }, [tryPlay, enabled, showHint]);

  const toggle = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    setHint(false);
    if (a.paused) await tryPlay();
    else {
      a.pause();
      setPlaying(false);
    }
  }, [tryPlay]);

  /* tự phát lúc tải + dự phòng ở cử chỉ đầu tiên */
  useEffect(() => {
    if (!src) return;
    const a = audioRef.current;
    if (!a) return;
    let done = false;
    const onFirst = async () => {
      if (done || a.error) return;
      if (await tryPlay()) {
        done = true;
        off();
      }
    };
    const off = () => {
      window.removeEventListener("pointerdown", onFirst, true);
      window.removeEventListener("keydown", onFirst, true);
    };
    const onErr = () => {
      setMissing(true);
      setPlaying(false);
      off();
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("error", onErr);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    window.addEventListener("pointerdown", onFirst, true);
    window.addEventListener("keydown", onFirst, true);
    tryPlay().then((ok) => {
      if (ok) {
        done = true;
        off();
      }
    });
    return () => {
      off();
      a.removeEventListener("error", onErr);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
      clearTimeout(hintTimer.current);
    };
  }, [src, tryPlay]);

  return { audioRef, src, enabled, missing, playing, hint, play, toggle };
}
