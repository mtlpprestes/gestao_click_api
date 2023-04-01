const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const routeOrganizer = require('./routes/organizer');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET;

const checkUser = (req, res, next) => {
  if(req.headers.secret !== secret)
    return res.status(401).send('Acesso negado!');

  for(const [key, value] of Object.entries(req.body)) {
    try {
      req.body[key] = JSON.parse(value)
    } catch(e) {
      continue;
    }
  }
  next();
}

app.all('*', checkUser);
routeOrganizer(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const { dailyRevision } = require('./message.js');
const CronJob = require('cron').CronJob;
const job = new CronJob('00 00 12 * * *', () => {
  dailyRevision();
}, null, true, 'America/Sao_Paulo');

module.exports = app;