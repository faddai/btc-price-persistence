'use strict';

var mongoose = require('./lib/mongoose');
var Schema = mongoose.Schema;

var marketDataSchema = new Schema({
    low: Number, // the minimum or lowest price within a given interval
    high: Number, //  the maximum or highest price within a given interval
    open: Number, // the first traded price within a given interval
    close: Number, // the last traded price within a given interval also known as `last`
    provider: String, // the exchange providing this market data
    timestamp: String, // time at which trade occurred
    volume: String, // volume of transactions
    ask: Number, // sell orders
    bid: Number, // buy orders
    symbol: String, // the other currency being traded against BTC eg. USD
    tid: String, // transaction or trade id. This is used to identify the transaction
    created_at: Date,
    modified_at: Date
});

// anytime there's a save operation, do the following
marketDataSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if ( !this.created_at ) {
        this.created_at = currentDate;
    }

    // default symbol, currently trading against USD (BTCUSD or XBTUSD)
    if ( !this.symbol ) {
        this.symbol = 'USD';
    }

    next(); // proceed with intended operation; save.
});

module.exports = mongoose.model('MarketData', marketDataSchema);
