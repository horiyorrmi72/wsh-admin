const express = require('express');
const route = require('./routes');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDb = require('./configs/db');
const bodyParser = require('body-parser');
const expressLayout = require('express-ejs-layouts');
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
		secret: 'my_secret_key',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: process.env.NODE_ENV === 'production' },
	})
);
app.use(expressLayout);

app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use('/api', route);
app.get('/admin', (req, res) => {
	const token = req.cookies.token;
	res.render('login', { token, error: null });
});
app.get('/dashboard', auth, (req, res) => {
	const token = req.cookies.token;
	// console.log(token);
	res.render('dashboard', { token });
});
let uri = `https://wsh-admin.onrender.com/api/events`;

app.get('/eventspage', (req, res) => {
	const token = req.cookies.token;
	// console.log(token);
	res.render('components/events/events', { token });
});

app.get('/lay', (req, res) => {
	const token = req.cookies.token;
	if (!token)
	{
		return res.redirect('/login');
	}
	res.render('layout', { token });
});

module.exports = app;
