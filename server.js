const express = require('express');
const route = require('./routes');
const cors = require('cors');
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const connectDb = require('./configs/db');

connectDb();

const app = express();
const corsOptions = {
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
app.use(cookieParser());
app.use(
	session({
		secret: 'my_secret_key',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);

app.set('view engine', 'ejs');
app.use(cors(corsOptions))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', route);
app.get('/login', (req, res) => {
	res.render('login', { error: null });
});

app.get('/dashboard', (req, res) => {
	const token = req.cookies.token; 
	if (!token) {
		return res.redirect('/login');
	}
	res.render('dashboard', { email });
});
module.exports = app;
