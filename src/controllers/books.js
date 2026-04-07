const { Book } = require('../models/user');

const getBooks = (request, response, next) => {
    // Get all books
    Book.find({})
        .then((data) => response.status(200).send(data))
        .catch(next);
};

const getBook = (request, response, next) => {
    // Get book
    const { book_id } = request.params;
    Book.findById(book_id)
        .then((data) => {
            if (!data) {
                return response.status(404).send({ message: 'Книга не найдена' });
            }
            response.status(200).send(data);
        })
        .catch(next);
};

const createBook = (request, response, next) => {
    // Create new book 
    Book.create({ ...request.body })
        .then((book) => response.status(201).send(book)) 
        .catch(next);
};

const updateBook = (request, response, next) => {
    const { book_id } = request.params;
    Book.findByIdAndUpdate(book_id, { ...request.body }, { new: true })
        .then((book) => {
            if (!book) {
                return response.status(404).send({ message: 'Книга не найдена' });
            }
            response.status(200).send(book);
        })
        .catch(next);
};

const deleteBook = (request, response, next) => {
    // Delete book
    const { book_id } = request.params;
    Book.findByIdAndDelete(book_id)
        .then((book) => { 
            if (!book) {
                return response.status(404).send({ message: 'Книга не найдена' });
            }
            response.status(200).send({ message: 'Книга успешно удалена' });
        })
        .catch(next);
};

module.exports ={
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};