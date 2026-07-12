import os
from flask import Flask, send_from_directory

# Thư mục chứa index.html và các file css/js (chính là thư mục đặt file này).
SITE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)


@app.route("/")
def index():
    return send_from_directory(SITE_DIR, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    # Phục vụ mọi file khác: styles.css, script.js, img/..., version.txt, v.v.
    return send_from_directory(SITE_DIR, filename)


@app.after_request
def add_no_cache(resp):
    """
    Buộc trình duyệt kiểm tra lại file mỗi lần mở web.
    - File chưa đổi  -> máy chủ trả 304 (vài byte, vẫn nhanh).
    - File đã đổi    -> tải bản mới ngay.
    => Ra bản mới là tự cập nhật, không cần sửa ?v hay thao tác gì.
    Flask tự thêm ETag/Last-Modified nên phần so sánh 304 chạy sẵn.
    """
    resp.headers["Cache-Control"] = "no-cache"
    return resp


if __name__ == "__main__":
    app.run(debug=True)
