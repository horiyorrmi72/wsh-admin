const express = require('express');
const route = require('./routes');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDb = require('./configs/db');
const bodyParser = require('body-parser');
const axios = require('axios');
const { auth, isAdmin } = require('./controllers/auth/authUtils');

connectDb();

const app = express();
const corsOptions = {
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
	Credential: true,
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
