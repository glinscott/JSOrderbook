function OrderTypes() {
	this.Bid = 0;
	this.Ask = 1;
}

function Order(id, orderType, limit, numShares, entryTime) {
	this.id = id;
	this.limit = limit;
	this.orderType = orderType;
	this.numShares = numShares;
	this.entryTime = entryTime;
	
	this.filled = 0;

	// Initialized when added to Limit
	this.prevOrder = null;
	this.nextOrder = null;
	this._isBooked = false;
}

Order.prototype.isBid = function() {
	return this.orderType === OrderTypes.Bid;
};

Order.prototype.isAsk = function() {
	return this.orderType === OrderTypes.Ask;
};

Order.prototype.isBooked = function() {
	return this._isBooked;
};

Order.prototype.book = function() {
	this._isBooked = true;
};

exports.OrderTypes = OrderTypes;
exports.Order = Order;