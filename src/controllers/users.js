 const { User, Book } = require('../models/user');

 const getUsers = (request, response) => {
    // Get all users
    return User.find({}).then((data) => {
        response.status(200).send(data) }
    ).catch(e => response.status(500).send({ message: e.message }));
};

const getUser = (request, response) => {
    // Get user
    const { user_id } = request.params;
    return User.findById(user_id).then((data) => {
        if (!data) {
            return response.status(404).send({ message: 'Пользователь не найден' });
        }
        response.status(200).send(data);
    }).catch(e => {
        if (e.name === 'CastError') {
            return response.status(404).send({ message: 'Некорректный ID пользователя' });
        }
        response.status(500).send({ message: e.message });
    });
};

const createUser = (request, response) => {
    // Create new user  
    return User.create({ ...request.body }).then(
        (user) => { response.status(201).send(user) }
    ).catch(e => response.status(500).send({ message: e.message }));
};

const updateUser = (request, response) => {
    // Update user
    const { user_id } = request.params;
    return User.findByIdAndUpdate(user_id, { ...request.body }, { new: true }).then(
       (user) => { 
        if (!user) {
            return response.status(404).send({ message: 'Пользователь не найден' });
        }
        response.status(200).send(user);
    }).catch(e => response.status(500).send({ message: e.message }));
};

const deleteUser = (request, response) => {
    // Delete user
    const { user_id } = request.params;
    return User.findByIdAndDelete(user_id).then(
       (user) => { 
        if (!user) {
            return response.status(404).send({ message: 'Пользователь не найден' });
        }
        response.status(200).send({ message: 'Пользователь успешно удалён' });
    }).catch(e => response.status(500).send({ message: e.message }));
};

const getBooks = (request, response) => {
    // Get all books
    return Book.find({}).then((data) => {
        response.status(200).send(data) }
    ).catch(e => response.status(500).send({ message: e.message }));
};

const getBook = (request, response) => {
    // Get book
    const { book_id } = request.params;
    return Book.findById(book_id).then((data) => {
        if (!data) {
            return response.status(404).send({ message: 'Книга не найдена' });
        }
        response.status(200).send(data);
    }).catch(e => {
        if (e.name === 'CastError') {
            return response.status(404).send({ message: 'Некорректный ID книги' });
        }
        response.status(500).send({ message: e.message });
    });
};

const createBook = (request, response) => {
    // Create new book 
    return Book.create({ ...request.body }).then(
        (book) => { response.status(201).send(book) }
    ).catch(e => response.status(500).send({ message: e.message }));
};

const updateBook = (request, response) => {
    // Update book
    const { book_id } = request.params;
    return Book.findByIdAndUpdate(book_id, { ...request.body }, { new: true }).then(
       (book) => { response.status(200).send(book) } 
    ).catch(e => response.status(500).send({ message: e.message }));
};

const deleteBook = (request, response) => {
    // Delete book
    const { book_id } = request.params;
    return Book.findByIdAndDelete(book_id).then((book) => { 
        if (!book) {
            return response.status(404).send({ message: 'Книга не найдена' });
        }
        response.status(200).send({ message: 'Книга успешно удалена' });
    }).catch(e => response.status(500).send({ message: e.message }));
};

// Получить все книги пользователя
const getUserBooks = (request, response) => {
    const { user_id } = request.params;
    
    return User.findById(user_id).populate('books')
        .then((user) => {
            if (!user) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            response.status(200).send(user.books || []);
        })
        .catch((e) => {
            if (e.name === 'CastError') {
                return response.status(404).send({ message: 'Некорректный ID пользователя' });
            }
            response.status(500).send({ message: e.message });
        });
};

// Взять книгу (выдать книгу пользователю)
const takeBook = (request, response) => {
    const { user_id, book_id } = request.params;
    
    Promise.all([
        User.findById(user_id),
        Book.findById(book_id)
    ])
    .then(([user, book]) => {
        if (!user) {
            return response.status(404).send({ message: 'Пользователь не найден' });
        }
        
        if (!book) {
            return response.status(404).send({ message: 'Книга не найдена' });
        }
        
        // Проверяем, не взята ли уже книга
        if (user.books && user.books.includes(book_id)) {
            return response.status(400).send({ message: 'Книга уже взята пользователем' });
        }
        
        // Добавляем книгу пользователю
        if (!user.books) {
            user.books = [];
        }
        user.books.push(book_id);
        
        return user.save();
    })
    .then((user) => {
        response.status(200).send({ 
            message: 'Книга успешно взята',
            user: {
                id: user._id,
                name: user.name,
                books: user.books
            }
        });
    })
    .catch((e) => {
        if (e.name === 'CastError') {
            return response.status(404).send({ message: 'Некорректный ID' });
        }
        response.status(500).send({ message: e.message });
    });
};

// Вернуть книгу
const returnBook = (request, response) => {
    const { user_id, book_id } = request.params;
    
    return User.findById(user_id)
        .then((user) => {
            if (!user) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            
            // Проверяем, есть ли книга у пользователя
            if (!user.books || !user.books.includes(book_id)) {
                return response.status(400).send({ message: 'Книга не найдена у пользователя' });
            }
            
            // Удаляем книгу из списка пользователя
            user.books = user.books.filter(id => id.toString() !== book_id);
            
            return user.save();
        })
        .then((user) => {
            response.status(200).send({ 
                message: 'Книга успешно возвращена',
                user: {
                    id: user._id,
                    name: user.name,
                    books: user.books
                }
            });
        })
        .catch((e) => {
            if (e.name === 'CastError') {
                return response.status(404).send({ message: 'Некорректный ID' });
            }
            response.status(500).send({ message: e.message });
        });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getUserBooks,
    takeBook,
    returnBook
}