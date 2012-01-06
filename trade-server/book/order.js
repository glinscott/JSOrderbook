function OrderTypes() {
	this.Bid = 0;
	this.Ask = 1;
}

function Order(id, orderType, numShares, entryTime) {
	this.id = id;
	this.orderType = orderType;
	this.numShares = numShares;
	this.entryTime = entryTime;

	// Initialized when added to Limit
	this.limit = -1;
	this.prevOrder = null;
	this.nextOrder = null;
}

Order.prototype.isBid = function() {
	return this.orderType === OrderTypes.Bid;
};

Order.prototype.isAsk = function() {
	return this.orderType === OrderTypes.Ask;
};

exports.OrderTypes = OrderTypes;
exports.Order = Order;