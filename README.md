# Demo Hono CRUD

API quản lý sách, viết bằng JavaScript trong một file `index.js`. Mỗi sách có `id` và `title`. Dữ liệu lưu trong mảng, không cần cài database.

## Bài tập CRUD với Hono

Các route CRUD trong `index.js` đang để dạng `TODO`, kèm hướng dẫn cho từng bước. Bạn cần hoàn thành phần xử lý trong mỗi route. Trước khi hoàn thành, các route này trả JSON với status `501` (chưa triển khai); route `/` vẫn hoạt động.

Bảng API và các lệnh thử bên dưới mô tả kết quả cần đạt sau khi hoàn thành TODO. Dùng `demo.http` để kiểm tra từng thao tác. File `express.js` có bản CRUD hoàn chỉnh để tham khảo và chạy ở cổng 3001.

## Chạy demo

Cần Node.js 22 trở lên và npm.

```bash
npm install
npm run dev
```

Mở http://localhost:3000/books để thử route danh sách. Khi hoàn thành TODO, route sẽ trả về danh sách ban đầu.

Chế độ `dev` tự khởi động lại server khi lưu code. Dữ liệu sẽ trở về ban đầu sau mỗi lần khởi động lại. Dừng server bằng `Ctrl+C`.

## Các API

### Chạy bản ExpressJS

Bản ExpressJS trong `express.js` có cùng API CRUD sách, quy tắc kiểm tra `title` và thông báo lỗi với bản Hono. Hai server có dữ liệu riêng trong bộ nhớ.

```bash
npm run dev:express
```

Mở http://localhost:3001/books để xem danh sách sách. Chạy bằng `npm run start:express` nếu không cần tự khởi động lại khi lưu code.

Có thể chạy đồng thời Hono ở cổng 3000 và ExpressJS ở cổng 3001 trong hai terminal. Để thử các lệnh `curl` bên dưới với ExpressJS, thay cổng `3000` bằng `3001`.

### Danh sách route

| Thao tác | Method | Đường dẫn | Kết quả |
| --- | --- | --- | --- |
| Xem danh sách | GET | `/books` | 200, mảng sách |
| Xem chi tiết | GET | `/books/:id` | 200, một sách |
| Thêm | POST | `/books` | 201, sách vừa tạo |
| Sửa | PUT | `/books/:id` | 200, sách đã sửa |
| Xoá | DELETE | `/books/:id` | 200, thông báo đã xoá |

POST và PUT nhận JSON dạng `{"title": "Tên sách"}`. Thiếu tên, tên rỗng hoặc JSON sai định dạng trả về `400`. Truy cập, sửa hoặc xoá sách không tồn tại trả về `404`.

## Thứ tự trình diễn

Chạy các lệnh dưới đây trong terminal thứ hai. Bắt đầu từ server vừa khởi động để sách mới có `id = 2`.

```bash
# 1. READ: Xem danh sách
curl http://localhost:3000/books

# 2. CREATE: Thêm sách
curl -X POST http://localhost:3000/books \
  -H 'Content-Type: application/json' \
  -d '{"title":"Lập trình Web"}'

# 3. READ: Xem sách vừa thêm
curl http://localhost:3000/books/2

# 4. UPDATE: Sửa tên sách
curl -X PUT http://localhost:3000/books/2 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Lập trình Web với Hono"}'

# 5. DELETE: Xoá sách
curl -X DELETE http://localhost:3000/books/2

# 6. Xem lại danh sách và kiểm tra sách đã xoá
curl http://localhost:3000/books
curl -i http://localhost:3000/books/2
```

Cũng có thể mở `demo.http` bằng extension REST Client của VS Code rồi bấm **Send Request** lần lượt, hoặc nhập cùng method, URL và JSON vào Postman.

## Gợi ý giải thích khi thuyết trình

1. `new Hono()` tạo ứng dụng; `app.get/post/put/delete()` khai báo route theo HTTP method.
2. `c` là context của request. `c.req.param('id')` lấy id từ URL, `await c.req.json()` đọc JSON từ body.
3. Mảng `books` đóng vai trò kho dữ liệu: `find()` tìm sách, `push()` thêm, gán `title` để sửa, `filter()` để xoá.
4. `c.json(data, status)` trả dữ liệu JSON cùng HTTP status. Ví dụ tạo thành công là `201`, không tìm thấy là `404`.
5. `serve()` mở server ở cổng 3000. Demo dùng bộ nhớ để tập trung vào cách Hono xử lý request và response.

Tham khảo: [Hướng dẫn Hono trên Node.js](https://hono.dev/docs/getting-started/nodejs).
