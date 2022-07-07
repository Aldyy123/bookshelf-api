const { addBooks, getAllBooks, getBook, updateBook, deleteBook } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooks
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBook
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook
  }
]

module.exports = { routes }
