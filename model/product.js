const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	city: {
		type: String
	},
	street: {
		type: String
	},
	descriptions: {
		type: String
	},
	room: {
		type: Number
	},
	productprice: {
		type: Number
	},
	url1: {
		type: String
	},
	url2: {
		type: String
	},
	url3: {
		type: String
	},
	user: {
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	}
});

const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = ProductModel;
