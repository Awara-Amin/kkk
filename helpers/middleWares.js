const moment = require('moment');
const express = require("express");

const app = express();

const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }: ${moment().format()}\n`
  );
  next();
};

// Body Parser Middleware
const jsonMiddleWare=app.use(express.json());
const urlMiddleWarre=app.use(express.urlencoded({ extended: false }));

// creat id

const uuid = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

module.exports = {logger,jsonMiddleWare , urlMiddleWarre, uuid};
