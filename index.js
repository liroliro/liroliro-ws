const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./router/productRouter');
const userRouter = require('./router/userRouter');
const config = require('./config/config');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const expressLayouts = require('express-ejs-layouts'); //admin
const flash = require('connect-flash'); //admin
const session = require('express-session'); //admin
const passport = require('passport'); //admin

require('./config/passport'); //admin

//middleware

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts); //admin
// app.use(express.static(path.join(__dirname, 'assets/images')));
app.use('/static', express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');

// admin
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);

// admin
app.use(passport.initialize());
app.use(passport.session());

// admin
app.use(flash());

// admin
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

//router
app.use(productRouter, userRouter);

//admin
//app.use("/", require("./router/adminRouter"));
app.use('/admin', require('./router/adminRouter'));

//listen to port
const PORT = process.env.PORT || 8000;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};
mongoose
	.connect(config.databaseURL, options)
	.then(() => {
		console.log('Server is hosted on ' + PORT);
		app.listen(PORT);
	})
	.catch(e => {
		console.log(e);
	});

module.exports = { app };
