/* ══════════════════════════════════════════════════════════════
   CONFIG — TOÀN BỘ NỘI DUNG CẦN SỬA NẰM Ở ĐÂY
   Ảnh: bỏ vào thư mục public/assets/ rồi điền đường dẫn, ví dụ "assets/hero.jpg".
   Để trống = hiện khung mẫu.
   ══════════════════════════════════════════════════════════════ */
const CONFIG = {
  groom: { name: "Phái Hà", photo: "assets/mystu50.jpg", parents: "Ông Phạm Quốc Hiếu\nBà Phạm Thị Kiệm" },
  bride: { name: "Thu Hà", photo: "assets/mystu92.jpg", parents: "Ông Vũ Hữu Lý\nBà Đinh Thị Lương" },

  heroPhoto: "assets/mystu106.jpg", // ảnh to đầu trang, tỉ lệ 4:5

  /* Ngày giờ hôn lễ (khối "Hôn lễ được cử hành vào lúc") và tiệc cưới.
     ISO kèm +07:00. Âm lịch tự tính. */
  ceremony: "2026-09-29T11:00:00+07:00", // Lễ Thành Hôn 11h sáng, Thứ Ba 29/09/2026
  party: "2026-09-29T11:00:00+07:00",

  /* Địa điểm — cái đầu là địa điểm chính (hiện lịch + bản đồ to).
     lat/lng để nhúng Google Maps; để 0 thì bản đồ tra theo địa chỉ. */
  venues: [
    {
      name: "Hội trường A · Hồ Cô Tiên Place",
      time: "Lễ Thành Hôn 11:00 · Thứ Ba 29.09.2026",
      address: "Hồ Cô Tiên Place", // điền địa chỉ đầy đủ và lat/lng để ghim bản đồ đúng chỗ
      lat: 0,
      lng: 0,
    },
  ],
  embedMap: true, // false = chỉ hiện nút Chỉ đường

  /* Chương trình trong ngày. icon: "invite" | "rings" | "party" | "cake" | "cheers" */
  timeline: [
    { time: "10:30", label: "Đón khách", icon: "invite" },
    { time: "11:00", label: "Lễ Thành Hôn", icon: "rings" },
    { time: "11:30", label: "Khai tiệc", icon: "party" },
  ],

  rsvpDeadline: "25.09.2026",
  /* API lưu chung trên Netlify (netlify/functions/guestbook.mjs): lời chúc mọi khách đều thấy,
     xác nhận tham dự xem/tải CSV bằng ADMIN_KEY. Để "" = chỉ lưu trên máy người xem (bản xem thử). */
  api: "/api/guestbook",

  /* Lời chúc có sẵn để mục Lưu bút không trống lúc mới phát thiệp */
  wishes: [{ name: "Gia đình hai bên", text: "Chúc hai con trăm năm hạnh phúc, sớm có tin vui ♥" }],

  gallery: [
    { src: "assets/mystu101.jpg", cap: "Váy cưới" },
    { src: "assets/mystu15.jpg", cap: "Áo dài đỏ" },
    { src: "assets/mystu126.jpg", cap: "Cô dâu" },
    { src: "assets/mystu25.jpg", cap: "Áo dài đỏ", wide: true },
    { src: "assets/mystu65.jpg", cap: "Studio" },
    { src: "assets/mystu27.jpg", cap: "Áo dài đỏ" },
    { src: "assets/mystu90.jpg", cap: "Cô dâu" },
    { src: "assets/mystu2.jpg", cap: "Áo dài đỏ" },
    { src: "assets/mystu59.jpg", cap: "Chú rể" },
  ],
  galleryVisible: 99, // hiện hết ảnh, không có nút "Xem thêm ảnh" (đặt 6 để bật lại nút trên điện thoại)

  gifts: [
    { role: "Mừng chú rể", holder: "PHAM PHAI HA", bank: "Vietcombank", number: "0000000000", qr: "" },
    { role: "Mừng cô dâu", holder: "VU THU HA", bank: "Techcombank", number: "0000000000", qr: "" },
  ],

  /* Nhạc nền: bỏ file vào public/assets/nhac.mp3. Tự phát khi tải trang nếu trình duyệt cho phép,
     không thì phát ngay lúc chạm mở phong bì. Chưa có file thì nút nhạc tự ẩn. Để "" = tắt hẳn. */
  music: "assets/nhac.mp3",
};
/* ══════════════ HẾT PHẦN CẦN SỬA ══════════════ */

export default CONFIG;
