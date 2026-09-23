# Thiệp cưới — bản React (Vite)

Dựng lại từ `../thiep/index.html` (bản "thiệp giấy"), giữ nguyên giao diện, CSS và
hành vi: phong bì mở thiệp, âm lịch, lịch tháng, đếm ngược,
album + lightbox, bản đồ, RSVP, lưu bút, hộp mừng cưới, nhạc nền, tim rơi, hiện dần khi cuộn.

```
thiep-react/
├─ index.html            ← khung trang, font Google
├─ public/assets/        ← bỏ ảnh cưới, ảnh QR, file nhạc vào đây
└─ src/
   ├─ config.js          ← TOÀN BỘ NỘI DUNG CẦN SỬA (tên, ngày, địa điểm, ảnh, STK…)
   ├─ styles.css         ← CSS giữ nguyên từ bản HTML
   ├─ App.jsx            ← ghép các mục, quản lý trạng thái mở thiệp
   ├─ main.jsx
   ├─ components/
   │  ├─ Gate.jsx        ← phong bì mở thiệp
   │  ├─ Cover.jsx       ← trang bìa PC + đếm ngược
   │  ├─ Hero.jsx        ← Save the date, cặp đôi, gia đình + ngày hôn lễ
   │  ├─ Gallery.jsx     ← album + lightbox
   │  ├─ Party.jsx       ← thông tin tiệc, địa điểm/bản đồ, timeline
   │  ├─ Forms.jsx       ← RSVP + lưu bút
   │  ├─ Gifts.jsx       ← hộp mừng cưới + lời cảm ơn
   │  ├─ DateBlock.jsx   ← khối ngày, dòng âm lịch, lịch tháng
   │  ├─ Extras.jsx      ← tim rơi, nút nhạc
   │  └─ common.jsx
   ├─ hooks/  useReveal.js (hiện dần khi cuộn), useMusic.js (nhạc nền)
   └─ lib/    lunar.js (âm lịch Hồ Ngọc Đức), date.js, store.js, icons.jsx
```

**Bố cục PC (từ 1024px), thiết kế lại khác bản HTML gốc:** tấm thiệp rộng 1120px đặt giữa nền
sẫm, có bóng đổ và viền kẻ mảnh như thiệp in. Trang mở đầu là ảnh cưới bên trái (khung mẫu nếu
chưa có `heroPhoto`), bên phải là tên, ngày, âm lịch, đếm ngược, "Kính gửi"; menu chạy ngang phía
dưới. Các mục bên dưới: cặp đôi hai cột quanh dấu &, gia đình hai bên vạch chia, album ba cột,
khung mời kèm lịch tháng, mỗi địa điểm có bản đồ xen kẽ trái phải, RSVP và lưu bút hai cột.
Toàn bộ nằm trong khối `@media (min-width:1024px)` cuối `src/styles.css`; phần CSS cho điện
thoại giữ nguyên từ bản gốc.

## Chạy

```
npm install
npm run dev        # http://localhost:3000
npm run build      # ra thư mục dist/
npm run preview    # xem thử bản build
```

## Sửa nội dung

Mở `src/config.js`. Các trường giống hệt bản HTML cũ (xem `../thiep/README.md`).
Ảnh để trong `public/assets/`, điền đường dẫn dạng `"assets/hero.jpg"`.

**Ảnh hiện có** (`public/assets/mystu*.jpg`): 12 ảnh studio đã nén về 1800px, JPEG 82%, tổng
khoảng 1.9 MB. Ảnh bìa là `mystu106`, ảnh tròn chú rể `mystu50`, cô dâu `mystu92`, 9 ảnh còn
lại trong album (`mystu25` là ảnh ngang, chiếm hai ô). Ảnh mới nên nén tương tự trước khi bỏ vào,
mỗi tấm dưới 300 KB là vừa.

Thiệp dùng chung một link `/`, không chia riêng theo tên khách (chữ "Quý khách" cố định).

**Màn mở thiệp:** mỗi lần tải trang đều hiện phong bì (không nhớ phiên). Chạm vào là con dấu
phồng lên rồi bung thành tim, nắp lật 3D, thư bay lên phóng to, phông zoom xuyên qua và mờ đi,
thiệp trồi lên kèm mưa tim vài giây. Với `prefers-reduced-motion` mọi hiệu ứng rút về gần tức thì.
Thời gian các bước nằm trong `Gate.jsx` (t1, t2) và khối "chuỗi mở thiệp" trong `styles.css`.

## Nhận Xác nhận tham dự và Lưu bút vào Google Sheets

Bảng tính đã tạo sẵn trên Drive:
https://docs.google.com/spreadsheets/d/1wxyENxwdc62tkzUWzdBsDOQdPPenCICLSWiW3233gPw/edit

Để trống `rsvpEndpoint` / `wishEndpoint` thì phản hồi chỉ lưu trên máy người xem (có dòng ghi chú
"Bản xem thử"). Muốn nhận về bảng tính trên, làm theo hướng dẫn ở đầu file `rsvp-apps-script.js`
(mở bảng tính → Extensions → Apps Script → dán code → Deploy dạng Web app, quyền "Anyone" →
copy URL `/exec` dán vào cả hai trường trong `src/config.js`). Script tự tạo hai sheet
"Xác nhận tham dự" và "Lưu bút" với dòng tiêu đề khi có dữ liệu đầu tiên.

## Nhạc nền

`public/assets/nhac.mp3` là đoạn 1 phút điệp khúc cuối bài "Beautiful In White" (Shane Filan),
cắt từ file của bạn ở 2:46 → 3:46, fade in 1.5s, fade out 3s, 128 kbps. Nhạc thử tự phát khi tải trang,
bị chặn thì phát lúc chạm mở phong bì. Thay bài khác: ghi đè file này hoặc đổi đường dẫn `music`.

## Đưa lên mạng

`npm run build` rồi kéo thư mục `dist/` vào [app.netlify.com/drop](https://app.netlify.com/drop),
hoặc `npx vercel --prod`. `vite.config.js` đặt `base: "./"` nên có thể mở thẳng file
`dist/index.html` hoặc đặt trong thư mục con.
