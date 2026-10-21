import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

// Dữ liệu lưu trong bộ nhớ, khởi động lại server sẽ về dữ liệu ban đầu.
let books = [{ id: 1, title: 'Học Hono' }]
let nextId = 2

app.get('/', (c) => c.text('Hono CRUD demo - GET /books'))

// READ: Lấy danh sách sách.
app.get('/books', (c) => {
  // TODO: Trả về danh sách books dưới dạng JSON với status 200.
  return c.json({ message: 'TODO: Lấy danh sách sách' }, 501)
})

// READ: Lấy một sách theo id.
app.get('/books/:id', (c) => {
  // TODO: Lấy id từ URL và chuyển sang kiểu Number.
  // TODO: Tìm sách trong books theo id.
  // TODO: Nếu không tìm thấy, trả JSON { message: 'Không tìm thấy sách' }, status 404.
  // TODO: Trả về sách tìm được dưới dạng JSON với status 200.
  return c.json({ message: 'TODO: Lấy chi tiết sách' }, 501)
})

// CREATE: Thêm sách mới.
app.post('/books', async (c) => {
  // TODO: Đọc JSON từ request body; xử lý trường hợp JSON sai định dạng.
  // TODO: Kiểm tra title là chuỗi không rỗng sau khi trim().
  // TODO: Nếu không hợp lệ, trả JSON { message: 'Gửi JSON có title là chuỗi không rỗng' }, status 400.
  // TODO: Tạo sách với id lấy từ nextId++, title đã trim(), rồi thêm vào books.
  // TODO: Trả về sách vừa tạo dưới dạng JSON với status 201.
  return c.json({ message: 'TODO: Thêm sách' }, 501)
})

// UPDATE: Sửa sách theo id.
app.put('/books/:id', async (c) => {
  // TODO: Lấy id từ URL, chuyển sang Number và tìm sách trong books.
  // TODO: Nếu không tìm thấy, trả JSON { message: 'Không tìm thấy sách' }, status 404.
  // TODO: Đọc JSON từ request body; xử lý trường hợp JSON sai định dạng.
  // TODO: Kiểm tra title là chuỗi không rỗng sau khi trim().
  // TODO: Nếu không hợp lệ, trả JSON { message: 'Gửi JSON có title là chuỗi không rỗng' }, status 400.
  // TODO: Cập nhật title của sách và trả về sách đã sửa với status 200.
  return c.json({ message: 'TODO: Sửa sách' }, 501)
})

// DELETE: Xoá sách theo id.
app.delete('/books/:id', (c) => {
  // TODO: Lấy id từ URL, chuyển sang Number và tìm sách trong books.
  // TODO: Nếu không tìm thấy, trả JSON { message: 'Không tìm thấy sách' }, status 404.
  // TODO: Loại sách có id tương ứng khỏi books.
  // TODO: Trả JSON { message: 'Đã xoá sách' } với status 200.
  return c.json({ message: 'TODO: Xoá sách' }, 501)
})

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Server đang chạy: http://localhost:3000')
})
