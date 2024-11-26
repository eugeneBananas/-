const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const NotFoundError = require('./errors/not-found-error');

const { PORT = 3001, DB_URL = 'mongodb+srv://user:<KkLYVrwP5E1a5eNZ>@cluster0.7u38o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' } = process.env;

const app = express();

mongoose.connect(DB_URL);
app.use(cors());

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/movies'));

// app.use((req, res, next) => {
//   next(new NotFoundError('Страницы не существует'));

app.use(errors());

app.listen(PORT, () => {
    console.log("Сервер запущен");
  });


