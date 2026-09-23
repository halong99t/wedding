import { useCallback, useEffect, useRef, useState } from "react";

/* Nhạc nền.
   - CHỈ bắt đầu phát khi khách chạm mở phong bì (play()), không tự phát lúc tải trang.
   - File không tải được (chưa bỏ vào public/assets) → missing=true, nút nhạc tự ẩn.
   - Nút nhạc góc màn hình để tắt/mở. */
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

  /* gọi đúng lúc khách chạm mở phong bì — cử chỉ người dùng nên trình duyệt cho phép */
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

  useEffect(() => {
    const a = audioRef.current;
    if (!src || !a) return;
    const onErr = () => {
      setMissing(true);
      setPlaying(false);
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("error", onErr);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    return () => {
      a.removeEventListener("error", onErr);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
      clearTimeout(hintTimer.current);
    };
  }, [src]);

  return { audioRef, src, enabled, missing, playing, hint, play, toggle };
}
