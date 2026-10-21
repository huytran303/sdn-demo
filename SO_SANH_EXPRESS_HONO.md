# So sánh Express.js và Hono

Tài liệu phục vụ bài thuyết trình và demo CRUD quản lý sách trong dự án này. Ví dụ Hono theo bản 4.x đang cài trong dự án; phần Express theo API 5.x.

## 1. Khác biệt cốt lõi

**Express.js hướng đến Node.js. Hono xây dựng trên Web Standards và hỗ trợ nhiều runtime.** Runtime là môi trường chạy JavaScript, ví dụ Node.js, Bun hoặc Deno.

Express mở rộng các đối tượng HTTP của Node.js thành `req` và `res`. Hono dùng các chuẩn như Fetch API, `Request` và `Response`, đồng thời cung cấp Context (`c`) để thao tác thuận tiện. Đây là khác biệt về nền tảng thiết kế, ảnh hưởng đến cách xử lý request và triển khai ứng dụng. Xem [Express API](https://expressjs.com/en/5x/api/) và [Hono Web Standards](https://hono.dev/docs/concepts/web-standard).

## 2. Bảng so sánh nhanh

| Tiêu chí | Express.js | Hono |
| --- | --- | --- |
| Cách tạo app | `express()` | `new Hono()` |
| Khai báo route | `app.get()`, `app.post()`, `app.put()`, `app.delete()` | Các method tương tự Express |
| Handler | `(req, res)`; thêm `next` khi cần chuyển tiếp | `(c)`; middleware nhận `(c, next)` |
| Lấy id từ URL | `req.params.id` | `c.req.param('id')` |
| Đọc JSON | Dùng `express.json()`, sau đó đọc `req.body` | `await c.req.json()` |
| Trả JSON và status | `res.status(201).json(data)` | `return c.json(data, 201)` |
| Mở server Node.js | `app.listen(3000)` | `serve({ fetch: app.fetch, port: 3000 })` qua adapter |

Đối chiếu cú pháp tại [Express routing](https://expressjs.com/en/5x/guide/routing/), [Express application API](https://expressjs.com/en/5x/api/application/), [Hono Context](https://hono.dev/docs/api/context) và [Hono Node.js](https://hono.dev/docs/getting-started/nodejs).

## 3. Cùng một chức năng, code khác nhau thế nào?

Hai ví dụ dưới đây đều tạo sách từ JSON `{"title":"Học Hono"}`, kiểm tra tên và trả sách vừa tạo với status `201`. Đây là hai ví dụ độc lập, chạy riêng vì cùng dùng cổng 3000.

### Express.js

```js
import express from 'express'

const app = express()
app.use(express.json())

const books = []
let nextId = 1

app.post('/books', (req, res) => {
  const body = req.body

  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return res.status(400).json({ message: 'Tên sách không hợp lệ' })
  }

  const book = { id: nextId++, title: body.title.trim() }
  books.push(book)
  return res.status(201).json(book)
})

app.listen(3000)
```

### Hono

```js
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()
const books = []
let nextId = 1

app.post('/books', async (c) => {
  const body = await c.req.json().catch(() => null)

  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return c.json({ message: 'Tên sách không hợp lệ' }, 400)
  }

  const book = { id: nextId++, title: body.title.trim() }
  books.push(book)
  return c.json(book, 201)
})

serve({ fetch: app.fetch, port: 3000 })
```

**Điểm cần chỉ ra khi trình chiếu:** phần tạo `book` và thêm vào mảng giống nhau. Phần thay đổi chủ yếu là đọc request, tạo response và khởi động server.

Express dùng middleware để đọc JSON trước handler. Hono đọc body bất đồng bộ trong handler nên ví dụ dùng `async/await`; `.catch(() => null)` giúp đưa JSON sai định dạng về nhánh `400`. Express có cơ chế xử lý lỗi parser riêng; muốn cùng cấu trúc JSON lỗi như Hono cần bổ sung error middleware. Xem [Express error handling](https://expressjs.com/en/guide/error-handling/).

## 4. Middleware: khác nhau ở cách chuyển tiếp

Middleware thường dùng cho log, xác thực và CORS. Đặt các middleware sau **trước route** để áp dụng cho route đó.

Express:

```js
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})
```

Hono:

```js
app.use('*', async (c, next) => {
  console.log('Trước handler:', c.req.method, c.req.path)
  await next()
  console.log('Sau handler:', c.res.status)
})
```

Express gọi `next()` để chuyển tiếp. Hono dùng `await next()`, cho phép viết xử lý trước và sau handler theo cùng một luồng async. Không nên dùng `await next()` trong Express với kỳ vọng đợi handler hoàn tất theo cách của Hono. Xem [Express middleware](https://expressjs.com/guide/using-middleware/) và [Hono middleware](https://hono.dev/docs/guides/middleware).

## 5. Triển khai và TypeScript

| Vấn đề | Express.js | Hono |
| --- | --- | --- |
| Node.js | Là môi trường thiết kế chính | Chạy qua adapter, như demo hiện tại |
| Cloudflare Workers, Bun, Deno | Cần xét khả năng tương thích của môi trường và thư viện | Có hướng dẫn hỗ trợ nhiều runtime |
| TypeScript | Có thể sử dụng với khai báo kiểu, thường qua `@types/express` | Cung cấp kiểu trong package và hỗ trợ suy luận kiểu |
| Chia sẻ kiểu API với client | Cần thiết kế hoặc bổ sung công cụ tương ứng | Có Hono RPC và client `hc` |

Hono RPC có thể suy luận kiểu đầu vào qua validator và kiểu đầu ra từ route. Lợi ích này cần cấu trúc TypeScript phù hợp; demo JavaScript hiện tại chưa sử dụng RPC. Kiểu TypeScript cũng không thay thế việc kiểm tra dữ liệu lúc chạy. Xem [Hono RPC](https://hono.dev/docs/guides/rpc) và [Express routing với TypeScript](https://expressjs.com/en/5x/guide/routing/).

Hỗ trợ nhiều runtime không có nghĩa mọi thư viện đều chạy ở mọi nơi. Ví dụ, code dùng hệ thống file hoặc driver database dành riêng cho Node.js vẫn cần kiểm tra khi chuyển sang Workers. Đây là điểm cần đánh giá khi triển khai dựa trên [thiết kế Web Standards của Hono](https://hono.dev/docs/concepts/web-standard).

## 6. Hono có luôn nhanh hơn Express không?

**Không thể kết luận cho mọi ứng dụng.** Hono công bố benchmark của adapter Node.js và mô tả các router được tối ưu. Kết quả đó phản ánh cấu hình và workload được đo. Xem [benchmark của Hono Node adapter](https://github.com/honojs/node-server#benchmarks) và [thiết kế router Hono](https://hono.dev/docs/concepts/routers).

Khi đánh giá dự án thực tế, cần đo cùng runtime, phần cứng, route, middleware và truy vấn database. Ví dụ minh hoạ: nếu request mất 100 ms để chờ database, tiết kiệm 1 ms ở framework chỉ giảm tổng thời gian từ 101 ms xuống 100 ms. Đây là phép tính minh hoạ, không phải số benchmark.

Câu phù hợp để trình bày: “Hono chú trọng hiệu năng và thiết kế gọn. Mức cải thiện thực tế cần được đo trên ứng dụng cụ thể.”

## 7. Khi nào nên chọn framework nào?

Đây là gợi ý lựa chọn dựa trên các khác biệt ở trên:

| Tình huống | Lựa chọn gợi ý | Lý do |
| --- | --- | --- |
| Đang có ứng dụng Express ổn định | Tiếp tục Express | Tránh chi phí chuyển đổi khi chưa có nhu cầu rõ ràng |
| Team quen Express, chạy Node.js, đã có middleware phù hợp | Express | Tận dụng kinh nghiệm và code hiện có |
| Xây API cần chạy trên Workers hoặc nhiều runtime | Hono | Thiết kế dựa trên Web Standards phù hợp yêu cầu |
| Muốn chia sẻ kiểu API giữa server và client TypeScript | Cân nhắc Hono | Có RPC và client tích hợp |
| Demo CRUD ngắn trong buổi học | Cả hai đều phù hợp | Cùng thể hiện rõ route, request, response và HTTP status |

Middleware Express nhận `req, res, next`; middleware Hono nhận `c, next`. Vì vậy, không thể mặc định sao chép nguyên middleware Express sang Hono. Cần tìm bản tương thích hoặc viết lại phần tích hợp.

## 8. Đoạn nói mẫu khoảng một phút

“Express.js và Hono đều giúp xây dựng API bằng các route như GET, POST, PUT và DELETE. Trong demo quản lý sách, logic thêm, sửa, xoá gần như giống nhau.

Điểm khác biệt lớn nằm ở thiết kế. Express hướng đến Node.js và làm việc với request, response qua `req` và `res`. Hono dựa trên các chuẩn web như Request và Response, dùng Context để thao tác và hỗ trợ nhiều môi trường chạy.

Ví dụ, Express đọc body qua `req.body` sau middleware `express.json()`, còn Hono dùng `await c.req.json()`. Express trả dữ liệu bằng `res.status(201).json()`, Hono dùng `return c.json(data, 201)`.

Với dự án Node.js đang dùng Express ổn định, tiếp tục Express là hợp lý. Khi cần nhiều runtime hoặc muốn dùng Hono RPC với TypeScript, Hono là lựa chọn đáng cân nhắc.”

## 9. Câu hỏi có thể gặp

**Hono có thay thế database không?** Không. Mảng `books` chỉ giúp demo dễ chạy; dữ liệu mất khi khởi động lại server. Ứng dụng thực tế có thể tích hợp database phù hợp môi trường triển khai.

**Có bắt buộc dùng TypeScript với Hono không?** Không. File `index.js` trong dự án đang dùng JavaScript.

**Express có hỗ trợ async/await không?** Có. Express 5 tự chuyển lỗi từ Promise bị reject trong handler sang luồng xử lý lỗi. Với Express 4, thường cần tự bắt lỗi và gọi `next(err)` hoặc dùng wrapper. Xem [Express error handling](https://expressjs.com/en/guide/error-handling/).

**Chuyển từ Express sang Hono có chỉ cần đổi tên hàm không?** Không. Cần rà soát body parser, middleware, xử lý lỗi, thư viện phụ thuộc và cách triển khai, bên cạnh cú pháp route.
