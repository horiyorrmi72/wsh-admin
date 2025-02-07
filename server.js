const express = require('express');
const route  = require('./routes');
const connectDb = require('./configs/db');

connectDb();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', route);


module.exports = app;
