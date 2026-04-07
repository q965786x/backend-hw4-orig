const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const loggerOne = require('./middlewares/loggerOne');

dotenv.config();

const app = express();

const {
    PORT = 3005,
    API_URL = "http://127.0.0.1",
    MONGO_URL = "mongodb://127.0.0.1:27017/backend-hw4"
} = process.env;

const willcomeToTheLibrary = (request, response) => {
    response.status(200).send('Willcome to the Library');
};

app.use(cors);
app.use(loggerOne);
app.use(bodyParser.json());


app.get('/', willcomeToTheLibrary)

app.post('/', (request, response) => {
    response.status(200).send('Hello from the Library');
})

app.use(userRouter);
app.use(bookRouter);

app.use((req, res) => {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
    console.error('❌ Ошибка:', err.message);
    
    if (err.name === 'ValidationError') {
        return res.status(400).send({ 
            message: 'Ошибка валидации данных',
            details: err.message 
        });
    }
    
    if (err.name === 'CastError') {
        return res.status(404).send({ 
            message: 'Некорректный ID' 
        });
    }

    if (err.code === 11000) {
        return res.status(409).send({ 
            message: 'Пользователь с таким username уже существует' 
        });
    }
    
    res.status(500).send({ 
        message: 'Что-то пошло не так на сервере!' 
    });
});

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ Сервер запустится, но БД недоступна');
    })
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен по адресу ${API_URL}:${PORT}`);
        });
    });