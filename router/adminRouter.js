//let convert = {};

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// Admin model
const Admin = require('../model/admin');
const { forwardAuthenticated } = require('../config/auth');

// Admin page
router.get('/admin', ensureAuthenticated, (req, res) =>
	res.render('admin.ejs', { admin })
);

// Login page

router.get('/loginadmin', forwardAuthenticated, (req, res) =>
	res.render('loginadmin')
); //

//Login handle
router.post('/loginadmin', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/admin/loginadmin',
		failureFlash: true
	})(req, res, next);
});

// Register page
router.get('/registeradmin', ensureAuthenticated, (req, res) =>
	res.render('registeradmin')
); //

// Register handle
router.post('/registeradmin', (req, res) => {
	const { employeeId, password, password2 } = req.body;
	let errors = [];

	//Check required fields
	if (!employeeId || !password || !password2) {
		errors.push({
			msg: 'Please fill in all fields'
		});
	}

	//Check passwords match
	if (password !== password2) {
		errors.push({
			msg: 'Passwords do not match'
		});
	}

	// Check password length
	if (password.length < 6) {
		errors.push({
			msg: 'Password should be at least 6 characters'
		});
	}
	if (errors.length > 0) {
		res.render('registeradmin', {
			errors,
			employeeId,
			password,
			password2
		});
	} else {
		// Validation passed
		Admin.findOne({
			employeeId: employeeId
		}).then(admin => {
			if (admin) {
				//Admin exists
				errors.push({
					msg: 'Employee is already registered'
				});
				res.render('registeradmin', {
					errors,
					employeeId,
					password,
					password2
				});
			} else {
				const newAdmin = new Admin({
					employeeId: employeeId,
					password: password
				});
				// Hash password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newAdmin.password, salt, (err, hash) => {
						if (err) throw err;

						//Set password to hashed
						newAdmin.password = hash;
						// Save admin in mongoDB
						newAdmin
							.save()
							.then(admin => {
								req.flash(
									'success_msg',
									'You are now registered and can log in'
								);
								res.redirect('/admin/loginadmin');
							})
							.catch(err => console.log(err));
					});
				});
			}
		});
	}
});

//Logout handel
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/admin/loginadmin');
});

module.exports = router;
