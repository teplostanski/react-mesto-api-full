/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const regExp = require('./utils/regexp');
const NotFoundError = require('./errors/not-found-err');
const { APP_PORT, FRONTEND_DOMAIN, APP_PROTOCOL } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors({
  origin: [`${APP_PROTOCOL}://${FRONTEND_DOMAIN}`],
  allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Content-Type'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    console.error('Unable to connect to mongodb', err);
  }
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }).unknown(true),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regExp),
    }).unknown(true),
  }),
  createUser,
);
app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger); // логгер ошибок

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send({ message: err.message || 'Неизвестная ошибка' });
});

app.listen(APP_PORT, () => {
  console.log(`App listening on port ${APP_PORT}`);
});
