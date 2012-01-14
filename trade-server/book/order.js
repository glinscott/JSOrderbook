var assert = require('assert');

function OrderTypesEnum() {
	this.Bid = 0;
	this.Ask = 1;
}

var OrderTypes = new OrderTypesEnum();

function Order(id, orderType, price, numShares, entryTime) {
	this.id = id;
	this.price = price;
	this.orderType = orderType;
	this.numShares = numShares;
	this.entryTime = entryTime;
	
	this.filled = 0;

	// Initialized when added to Limit
	this.prevOrder = null;
	this.nextOrder = null;
	this._parentLimit = null;
}

Order.prototype.isBid = function() {
	return this.orderType === OrderTypes.Bid;
};

Order.prototype.isAsk = function() {
	return this.orderType === OrderTypes.Ask;
};

Order.prototype.isBooked = function() {
	return this._parentLimit !== null;
};

Order.prototype.getParentLimit = function() {
	return this._parentLimit;
};

Order.prototype.book = function(parentLimit) {
	this._parentLimit = parentLimit;
};

Order.prototype.fill = function(size) {
	this.filled += size;
	assert(this.filled <= this.numShares);
};

Order.prototype.getAvailableShares = function() {
	return this.numShares - this.filled;
};

exports.OrderTypes = OrderTypes;
exports.Order = Order;