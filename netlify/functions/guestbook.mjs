/* Lưu "Lưu bút" và "Xác nhận tham dự" ngay trên Netlify (Blobs), mọi khách đều thấy chung.

   GET  /api/guestbook?type=wish                       → danh sách lời chúc (mới nhất trước)
   GET  /api/guestbook?type=rsvp&key=ADMIN_KEY         → danh sách xác nhận (cần khoá)
   GET  /api/guestbook?type=rsvp&key=ADMIN_KEY&format=csv → tải CSV mở bằng Excel
   GET  /api/guestbook?type=wish&format=csv            → CSV lời chúc
   POST /api/guestbook  {type:"wish", name, text} | {type:"rsvp", fullName, willCome, numberOfPeople, page}

   Biến môi trường (Netlify → Site configuration → Environment variables):
     ADMIN_KEY   khoá xem/tải danh sách xác nhận tham dự
     SHEETS_URL  (tuỳ chọn) URL /exec của Google Apps Script — có thì chuyển tiếp thêm sang Google Sheets */
import { getStore } from "@netlify/blobs";

const MAX_LIST = 400;
const clean = (v, n) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const csv = (rows, header, filename) => {
  const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const body = [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  return new Response("﻿" + body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
};

const vnTime = (iso) =>
  new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });

export default async (req) => {
  /* consistency strong: ghi xong đọc lại thấy ngay (mặc định "eventual" có thể trễ tới 60s) */
  const store = getStore({ name: "thiep", consistency: "strong" });
  const url = new URL(req.url);
  const type = url.searchParams.get("type") === "rsvp" ? "rsvp" : "wish";
  const key = type + ".json";
  const isAdmin = !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;

  /* DELETE /api/guestbook?type=wish&key=ADMIN_KEY&at=<mốc thời gian của mục> → xoá một mục */
  if (req.method === "DELETE") {
    if (!isAdmin) return json({ ok: false, error: "unauthorized" }, 401);
    const at = url.searchParams.get("at");
    const list = (await store.get(key, { type: "json" })) || [];
    const next = list.filter((x) => x.at !== at);
    await store.setJSON(key, next);
    return json({ ok: true, removed: list.length - next.length, count: next.length });
  }

  if (req.method === "GET") {
    if (type === "rsvp" && !isAdmin) return json({ ok: false, error: "unauthorized" }, 401);
    const list = (await store.get(key, { type: "json" })) || [];
    if (url.searchParams.get("format") === "csv") {
      return type === "rsvp"
        ? csv(
            list.map((r) => [vnTime(r.at), r.fullName, r.willCome, r.numberOfPeople, r.page]),
            ["Thời gian", "Tên", "Tham dự", "Số người", "Trang"],
            "xac-nhan-tham-du.csv"
          )
        : csv(list.map((w) => [vnTime(w.at), w.name, w.text]), ["Thời gian", "Tên", "Lời chúc"], "luu-but.csv");
    }
    return json({ ok: true, count: list.length, items: list.slice(-MAX_LIST).reverse() });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "bad json" }, 400);
    }
    const t = body.type === "rsvp" ? "rsvp" : "wish";
    const at = new Date().toISOString();
    let item;
    if (t === "wish") {
      const name = clean(body.name, 60), text = clean(body.text, 600);
      if (!name || !text) return json({ ok: false, error: "missing" }, 400);
      item = { name, text, at };
    } else {
      const fullName = clean(body.fullName, 60);
      if (!fullName) return json({ ok: false, error: "missing" }, 400);
      item = {
        fullName,
        willCome: body.willCome === "Không" ? "Không" : "Có",
        numberOfPeople: clean(body.numberOfPeople, 3),
        page: clean(body.page, 200),
        at,
      };
    }
    const k = t + ".json";
    const list = (await store.get(k, { type: "json" })) || [];
    list.push(item);
    await store.setJSON(k, list);

    /* chuyển tiếp sang Google Sheets nếu đã cấu hình SHEETS_URL */
    const sheets = process.env.SHEETS_URL;
    if (sheets) {
      try {
        await fetch(sheets, {
          method: "POST",
          headers: { "content-type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ type: t, ...item }),
        });
      } catch {
        /* Sheets lỗi không làm hỏng phản hồi cho khách */
      }
    }
    return json({ ok: true, item });
  }

  return json({ ok: false, error: "method not allowed" }, 405);
};

export const config = { path: "/api/guestbook" };
