const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	resetToken: String,
	expirationToken: Date,
	wishlist: [
		{
			productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
		}
	],
	cart: [
		{
			productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
			quantity: {
				type: Number,
				require: true
			}
		}
	]
});

userSchema.methods.addToWishlist = function(product) {
	this.wishlist.push({ productId: product._id });
	return this.save();
};

userSchema.methods.addToCart = function(product) {
	this.cart.push({ productId: product._id });
	return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
	const filterItems = this.cart.filter(
		product => product.productId.toString() !== productId
	);

	this.cart = filterItems;

	return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
