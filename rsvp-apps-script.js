/**
 * Google Apps Script — nhận "Xác nhận tham dự" và "Lưu bút" từ thiệp, ghi vào Google Sheets.
 *
 * CÁCH CÀI (5 phút, làm một lần):
 *  1. Mở https://sheets.new → đặt tên bảng tính, ví dụ "Thiệp cưới – RSVP & Lưu bút".
 *  2. Menu Tiện ích mở rộng (Extensions) → Apps Script. Xoá code mẫu, dán toàn bộ file này vào, Ctrl+S.
 *  3. Bấm Triển khai (Deploy) → Tạo triển khai mới (New deployment) → biểu tượng bánh răng → Ứng dụng web (Web app)
 *       - Thực thi dưới tên (Execute as): Tôi (Me)
 *       - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)   ← bắt buộc, không phải "Anyone with Google account"
 *     → Triển khai → cấp quyền cho script (chọn tài khoản → Advanced → Go to … (unsafe) → Allow).
 *  4. Sao chép URL dạng https://script.google.com/macros/s/XXXX/exec
 *     Dán vào src/config.js ở CẢ HAI trường rsvpEndpoint và wishEndpoint. Build lại là xong.
 *
 *  Sửa code sau này: dán code mới → Deploy → Quản lý triển khai (Manage deployments) → bút chì → Phiên bản: Mới → Triển khai.
 *  (Tạo "triển khai mới" sẽ ra URL khác, phải dán lại vào config.)
 *
 *  Kiểm tra nhanh: mở URL /exec trên trình duyệt → thấy {"ok":true,...} là script sống.
 */

var SHEETS = {
  rsvp: { name: "Xác nhận tham dự", header: ["Thời gian", "Tên", "Tham dự", "Số người", "Trang"] },
  wish: { name: "Lưu bút",          header: ["Thời gian", "Tên", "Lời chúc"] }
};

function doGet() {
  return json_({ ok: true, message: "Thiệp cưới – endpoint đang hoạt động" });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var type = data.type === "wish" ? "wish" : "rsvp";
    var sheet = getSheet_(type);
    var now = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    if (type === "rsvp") {
      sheet.appendRow([now, data.fullName || "", data.willCome || "", data.numberOfPeople || "", data.page || ""]);
    } else {
      sheet.appendRow([now, data.name || "", data.text || ""]);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* Lấy (hoặc tạo) sheet theo loại, kèm dòng tiêu đề in đậm và cố định */
function getSheet_(type) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var def = SHEETS[type];
  var sheet = ss.getSheetByName(def.name);
  if (!sheet) {
    sheet = ss.insertSheet(def.name);
    sheet.appendRow(def.header);
    sheet.getRange(1, 1, 1, def.header.length).setFontWeight("bold").setBackground("#F7F4EE");
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, def.header.length, 180);
    if (type === "wish") sheet.setColumnWidth(3, 480);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
