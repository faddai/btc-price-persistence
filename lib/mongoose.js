var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/btc-price");

module.exports = mongoose;