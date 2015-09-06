var express = require('express'), 
    books = require('./routes/books.js')

var app = express();

app.configure(function () {
    app.use(express.logger('dev'))
    app.use(express.bodyParser())
})

app.get('/books', books.findAll)
app.get('/books/:id', books.findById)
app.post('/books', books.addBook)
app.put('/books/:id', books.updateBook)
app.delete('books/:id', books.deleteBook)

app.listen(3000)

console.log('Server running at http://127.0.0.1:3000/');