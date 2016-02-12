/**
 * Created by faddai on 15/11/2015.
 */

'use strict';

var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var bindAll = require('lodash.bindall');

var WebsocketClient = function (uri) {
    bindAll(this);
    this.websocketURI = uri || 'http://localhost';
    EventEmitter.call(this);

    this.connect();
};

util.inherits(WebsocketClient, EventEmitter);

WebsocketClient.prototype.connect = function () {
    
    if (this.socket) {
        this.socket.close();
    }

    this.socket = io(this.websocketURI);

    // events
    this.socket.on('open', this.onOpen.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('connect_error', this.onError.bind(this));
    this.socket.on('timeout_error', this.onTimeout.bind(this));
    this.socket.on('market data', this.onMarketData.bind(this));

    this.socket.on('connect', function() {
        console.log('Connection established on ', new Date());
    });
};

WebsocketClient.prototype.disconnect = function () {
    if (!this.socket) {
        throw 'Server already disconnected';
    }

    this.socket.close();
    this.onClose();
};

WebsocketClient.prototype.onError = function (err) {

    var msg = '';

    switch (err.type) {
        case 'TransportError':
            msg = 'The WS server is unreachable. Is this URL "'+ this.websocketURI +'" correct?';
            break;

        default:
            msg = 'error occurred: ', err.type;
            break;
    }

    console.log(msg);

};

WebsocketClient.prototype.onTimeout = function () {
    this.emit('timeout');
};

WebsocketClient.prototype.onOpen = function () {
    // subscribe to channels and keep alive the connection
    this.emit('open');

    var self = this;
    setInterval(function () {
        // Set a 30 second ping to keep connection alive
        self.socket.ping('keepalive');
    }, 30000);
};

WebsocketClient.prototype.onClose = function () {
    this.emit('close');
};

WebsocketClient.prototype.onMarketData = function (data) {
    this.emit('market data', data);
};


module.exports = WebsocketClient;