 const { User, Book } = require('../models/user');

 const getUsers = (request, response, next) => {
    // Get all users
    User.find({})
        .then((data) => response.status(200).send(data)) 
        .catch(next);
};

const getUser = (request, response, next) => {
    // Get user
    const { user_id } = request.params;
    User.findById(user_id)
        .then((data) => {
            if (!data) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            response.status(200).send(data);
        })
        .catch(next);
};

const createUser = (request, response, next) => {
    // Create new user  
    User.create({ ...request.body })
        .then((user) => response.status(201).send(user))
        .catch(next);
};

const updateUser = (request, response, next) => {
    // Update user
    const { user_id } = request.params;
    User.findByIdAndUpdate(user_id, { ...request.body }, { new: true })
        .then((user) => { 
            if (!user) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            response.status(200).send(user);
        })
        .catch(next);
};

const deleteUser = (request, response, next) => {
    // Delete user
    const { user_id } = request.params;
    User.findByIdAndDelete(user_id)
        .then((user) => { 
            if (!user) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            response.status(200).send({ message: 'Пользователь успешно удалён' });
        })
        .catch(next);
};



// Получить все книги пользователя
const getUserBooks = (request, response, next) => {
    const { user_id } = request.params;
    
    User.findById(user_id).populate('books')
        .then((user) => {
            if (!user) {
                return response.status(404).send({ message: 'Пользователь не найден' });
            }
            response.status(200).send(user.books || []);
        })
        .catch(next);
};

// Взять книгу (выдать книгу пользователю)
const takeBook = (request, response, next) => {
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
    .catch(next);
};

// Вернуть книгу
const returnBook = (request, response, next) => {
    const { user_id, book_id } = request.params;
    
    User.findById(user_id)
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
        .catch(next);
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserBooks,
    takeBook,
    returnBook
}