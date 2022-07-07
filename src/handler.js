const books = require('./model')
const generateUniqueId = require('generate-unique-id')

const addBooks = (req, h) => {
  // Generate ID
  const id = generateUniqueId({
    length: 10,
    useLetters: true,
    useNumbers: true
  })

  // Generate Time
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const { pageCount, readPage, name } = req.payload

  // Check name is empty
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  // Check Read page more than page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  // Adding data to books
  const newBook = {
    id, ...req.payload, finished: pageCount === readPage, insertedAt, updatedAt
  }
  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  // Success adding books
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  // Error if fail add books
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooks = (req, h) => {
  const { name, reading, finished } = req.query

  // Books new varabel
  let allBooks = books

  // Filter by query Name
  if (name !== undefined) {
    allBooks = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
  }
  //   Filter by reading
  if (reading !== undefined) {
    allBooks = books.filter(book => book.reading === (reading > 0))
  }
  //   Filter by finished
  if (finished !== undefined) {
    allBooks = books.filter(book => book.finished === (finished > 0))
  }

  // Get 3 book contains name, id, publisher
  const getBook = []
  allBooks.map(function (value, i) {
    const { id, publisher } = value
    getBook.push({ id, name: value.name, publisher })
    return value
  })

  // Success views books
  const response = h.response({
    status: 'success',
    data: { books: getBook }
  })
  response.code(200)
  return response
}

const getBook = (req, h) => {
  const id = req.params.bookId

  // Filter book by id
  const book = books.filter(book => book.id === id)[0]

  // Check book is not undefined
  if (book !== undefined) {

    // Return success
    const response = h.response({
      status: 'success',
      data: { book }
    })
    response.code(200)
    return response
  }

  // Return error if fail
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const updateBook = (req, h) => {
  const { pageCount, readPage, name } = req.payload
  const id = req.params.bookId
  const updatedAt = new Date().toISOString()

  // Check name is empty
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  // Check Read page more than page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  // Update payload books and search index books
  const index = books.findIndex(book => book.id === id)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...req.payload,
      updatedAt
    }

    // Success update
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  // Fail update books
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBook = (req, h) => {
  const id = req.params.bookId
  const index = books.findIndex(book => book.id === id)

  // Success delete book
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  // Fail delete book
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBooks,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook
}
