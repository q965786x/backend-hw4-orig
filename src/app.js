const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const {
    PORT = 3000,
    API_URL = "http://127.0.0.1"
} = process.env;

app.get('/', (request, response) => {
    response.status(200);
    response.send('Willcome to the Library');
})

app.post('/', (request, response) => {
    response.status(200);
    response.send('Hello from the Library');
})

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу ${API_URL}:${PORT}`);
})