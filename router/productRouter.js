const express = require('express');
const ProductModel = require('../model/product');
const BookingModel = require('../model/booking');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
	let pagination = req.query.page;
	res.render('index');
});

router.get('/admin', (req, res) => {
	res.render('admin');
});

let newapartment;

router.post('/createproduct', async (req, res) => {
	newapartment = new ProductModel({
		city: req.body.city,
		street: req.body.street,
		descriptions: req.body.descriptions,
		room: req.body.room,
		productprice: req.body.productprice,
		url1: req.body.url1,
		url2: req.body.url2,
		url3: req.body.url3,
		user: '5e68cf2e94a6fb38f4adaded'
	}).save();

	//const response = await newapartment.save();
	res.redirect('/createproduct');
});

router.get('/createproduct', async (req, res) => {
	const product_per_page = 8;
	const page = +req.query.page; //number(req.query.page)
	//räknar total antal produkter
	const countProduct = ProductModel.find().countDocuments();

	const products = await ProductModel.find()
		.populate('user -expirationToken -resetToken')
		.skip(product_per_page * (page - 1))
		.limit(product_per_page);

	res.render('createproduct.ejs', {
		products,
		//total produkter
		countProduct,
		//current page
		currentPage: page,
		//om det finns en till sida.
		hasNextPage: product_per_page < page * product_per_page,
		//has previous page
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1,

		//last page
		lastPage: Math.ceil(countProduct / product_per_page)
	});
});

router.get('/contact', (req, res) => {
	res.render('contact');
});

router.get('/product', async (req, res) => {
	const product_per_page = 3;
	const page = +req.query.page; //number(req.query.page)
	//räknar total antal produkter
	const products = await ProductModel.find()
		.skip(product_per_page * (page - 1))
		.limit(product_per_page);
	const countProduct = products.length;

	const pLength = await (await ProductModel.find()).length;

	const numberOfPages =
		pLength % product_per_page >= 1
			? parseInt(pLength / product_per_page) + 1
			: parseInt(pLength / product_per_page);

	// console.log('Nop:', numberOfPages);
	// console.log('prLength', pLength);
	// console.log('reqpage', page);
	res.render('product.ejs', {
		products,
		countProduct,
		currentPage: page,
		numberOfPages
	});
});

let newBooking;
router.post('/addtocart', async (req, res) => {
	console.log(req.body);
	newBooking = await new BookingModel({
		/* ownerUserId: ,
		locationId: , */
		/* dateTimeFrom: req.body.dateTimeFrom, */

		bookingDate: req.body.bookingDate,
		numberOfAttendees: req.body.numberOfAttendees
	}).save();

	res.redirect('/addtocart');
});

//Försöker konvertera string till date i mongoDb//Backlog
/* const bookingDb = BookingModel.find();

bookingDb.forEach(function (doc) {
	doc.bookingDate = new ISODate(doc.bookingDate);
	db.bookingDb.save(doc);
}) */

router.get('/update/:id', async (req, res) => {
	const response = await ProductModel.findById({ _id: req.params.id });
	console.log(response);

	res.render('edit', { response });
});

router.post('/update/:id', async (req, res) => {
	await ProductModel.updateOne(
		{ _id: req.body._id },
		{
			$set: {
				city: req.body.city,
				street: req.body.street,
				descriptions: req.body.descriptions,
				room: req.body.room,
				productprice: req.body.productprice,
				url1: req.body.url1,
				url2: req.body.url2,
				url3: req.body.url3
			}
		},
		{ runValidators: true }
	);
	console.log(req.body);
	res.redirect('/createproduct');
});

module.exports = router;
