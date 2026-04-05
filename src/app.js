const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const loggerOne = require('./middlewares/loggerOne');

dotenv.config();

const app = express();

const {
    PORT = 3000,
    API_URL = "http://127.0.0.1",
    MONGO_URL = "mongodb://127.0.0.1:27017/backend-hw4"
} = process.env;

const willcomeToTheLibrary = (request, response) => {
    response.status(200);
    response.send('Willcome to the Library');
};

app.use(cors);
app.use(loggerOne);
app.use(bodyParser.json());

app.get('/', willcomeToTheLibrary)

app.post('/', (request, response) => {
    response.status(200);
    response.send('Hello from the Library');
})

app.use(userRouter);

app.use((req, res) => {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Что-то пошло не так!' });
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