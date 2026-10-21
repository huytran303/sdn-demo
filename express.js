import express from 'express'

const app = express()

// Dữ liệu lưu trong bộ nhớ, khởi động lại server sẽ về dữ liệu ban đầu.
let books = [{ id: 1, title: 'Học Hono' }]
let nextId = 2

app.use(express.json({ strict: false }))

// JSON sai định dạng được xử lý như body không hợp lệ trong bản Hono.
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    req.body = null
    return next()
  }

  return next(error)
})

app.get('/', (req, res) => res.type('text').send('Express CRUD demo - GET /books'))

// READ: Lấy danh sách sách.
app.get('/books', (req, res) => res.json(books))

// READ: Lấy một sách theo id.
app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id)
  const book = books.find((book) => book.id === id)

  if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' })
  return res.json(book)
})

// CREATE: Thêm sách mới.
app.post('/books', (req, res) => {
  const body = req.body

  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return res.status(400).json({ message: 'Gửi JSON có title là chuỗi không rỗng' })
  }

  const book = { id: nextId++, title: body.title.trim() }
  books.push(book)
  return res.status(201).json(book)
})

// UPDATE: Sửa sách theo id.
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id)
  const book = books.find((book) => book.id === id)

  if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' })

  const body = req.body

  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return res.status(400).json({ message: 'Gửi JSON có title là chuỗi không rỗng' })
  }

  book.title = body.title.trim()
  return res.json(book)
})

// DELETE: Xoá sách theo id.
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id)
  const book = books.find((book) => book.id === id)

  if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' })

  books = books.filter((book) => book.id !== id)
  return res.json({ message: 'Đã xoá sách' })
})

app.listen(3001, () => {
  console.log('Server đang chạy: http://localhost:3001')
})
