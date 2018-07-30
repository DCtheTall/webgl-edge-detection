const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', path.join(path.resolve('.'), '/views'));

app.use(express.static(path.join(path.resolve('.'), '/public')));

app.get('/', (req, res) =>
  res.render('index', { dev: process.env.NODE_ENV === 'development'}));

module.exports = app;
