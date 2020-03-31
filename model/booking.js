const mongoose = require('mongoose');



var Schema = mongoose.Schema;

var BookingSchema = new Schema({
    /*  ownerUserId: String,
     locationId: String, */
    bookingDate: {
        type: String,
        required: true
    },
    numberOfAttendees: {
        type: Number,
        required: true
    },
    user: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
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

module.exports = mongoose.model('Booking', BookingSchema);

