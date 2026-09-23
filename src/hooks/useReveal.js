import { useEffect } from "react";

/* Hiện dần các phần tử .rv trong container khi cuộn tới.
   Chỉ chạy sau khi thiệp đã mở (enabled = true).
   Phần đang nằm trong khung nhìn được gán .in ngay trong một lượt (không qua rAF) để không có
   hai đợt hiện cách nhau một khung hình; phần còn lại giao cho IntersectionObserver. */
export function useReveal(ref, enabled) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const els = Array.from(ref.current.querySelectorAll(".rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const vh = window.innerHeight;
    const rest = [];
    els.forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < vh * 1.05 && r.bottom > 0) e.classList.add("in");
      else rest.push(e);
    });
    if (!rest.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    rest.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ref, enabled]);
}
