const express = require('express');
const route = require('./routes');
const cors = require('cors');
const session = require('express-session');
const connectDb = require('./configs/db');
const bodyParser = require('body-parser');
const axios = require('axios');
const { auth, isAdmin } = require('./controllers/auth/authUtils');

connectDb();

const app = express();
const corsOptions = {
	origin: process.env.CLIENT_URL || 'http://localhost:4200',
	methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204,
	preflightContinue: false,
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: process.env.NODE_ENV === 'production' },
	})
);


app.use(cors(corsOptions));


app.use('/api', route);


module.exports = app;
