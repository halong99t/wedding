import { useEffect } from "react";

/* Hiện dần các phần tử .rv trong container khi cuộn tới.
   Chỉ chạy sau khi thiệp đã mở (enabled = true). */
export function useReveal(ref, enabled) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const els = Array.from(ref.current.querySelectorAll(".rv"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
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
    els.forEach((e) => io.observe(e));
    /* phần đã nằm trong khung nhìn lúc tải thì hiện ngay */
    const raf = requestAnimationFrame(() =>
      els.forEach((e) => {
        if (e.getBoundingClientRect().top < window.innerHeight) e.classList.add("in");
      })
    );
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ref, enabled]);
}
