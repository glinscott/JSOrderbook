var assert = require('assert');
var Tree = require('bintrees').RBTree;
var Limit = require('./limit');
var Price = require('./price').Price;

function OrderBook() {
	var compareLimit = function(l1, l2) {
		return l1.getPrice() - l2.getPrice();
	};
	
	this._bidTree = new Tree(compareLimit);
	this._askTree = new Tree(compareLimit);
	this._highestBid = null;
	this._lowestAsk = null;
	
	// Map from orderId to order
	this._orders = {};
}

//////////////////////////////////////
// Core
//////////////////////////////////////

// Returns the appropriate limit tree for the order
OrderBook.prototype._getTreeForOrder = function(order) {
	if (order.isBid()) {
		return this._bidTree;
	} else if (order.isAsk()) {
		return this._askTree;
	} else {
		throw new Error('Order type must be bid or ask');
	}
};

// Limit Order
// Places an order at a given price.  Can be a bid or ask.
OrderBook.prototype.limit = function(order) {
	var tree = this._getTreeForOrder(order),
			orderLimit = tree.find({getPrice:function() { return order.price; }});

	if (orderLimit === null) {
		orderLimit = new Limit.Limit(order.price);
		tree.insert(orderLimit);
	}
	orderLimit.addOrder(order);
	
	if (this._orders.hasOwnProperty(order.id)) {
		throw new Error('Order id already added');
	}
	this._orders[order.id] = order;

	if (order.isBid() && this.bestBid() < order.price) {
		this._highestBid = orderLimit;
	} else if (order.isAsk() && this.bestAsk() > order.price) {
		this._lowestAsk = orderLimit;
	}
	
	// Execute the trades that are now viable
	while (this.bestBid() >= this.bestAsk()) {
		this._execute();
	}
	
	return order.id;
};

// Cancels the given order, removing it from the book.
OrderBook.prototype.cancel = function(orderId) {
	var order = this._orders[orderId];
	if (order === undefined) {
		throw new Error('Order is not booked');
	}

	assert.equal(order.isBooked(), true);
	order.getParentLimit().removeOrder(order);
	
	if (order.isBid()) {
		this._postProcessBid(order);
	} else {
		this._postProcessAsk(order);
	}	
};

// Returns the best bid (buying) price
OrderBook.prototype.bestBid = function() {
	if (this._highestBid === null) {
		return Price.NoBid;
	}
	return this._highestBid.getPrice();
};

// Returns the best ask (selling) price
OrderBook.prototype.bestAsk = function() {
	if (this._lowestAsk === null) {
		return Price.NoAsk;
	}
	return this._lowestAsk.getPrice();
};

//////////////////////////////////////
// Advanced Order Types
//////////////////////////////////////

// Market Order - executes immediately at the best price possible.
// Returns the id of the executed order.
OrderBook.prototype.market = function(order) {
	order.price = order.isAsk() ? Price.BestAsk : Price.BestBid;
	return this.limit(order);
};

// Replaces the given orderId with newOrder
OrderBook.prototype.replace = function(orderId, newOrder) {
	this.cancel(orderId);
	this.limit(newOrder);
};

// Adds an order that is guaranteed to add liquidity to the market.  Prices
// the order at the best price + offset
OrderBook.prototype.post = function(order, offset) {
	var price;
	if (order.isAsk()) {
		if (this._highestBid === null) {
			throw new Error('Unable to place post ask when there are no bids');
		}
		price = this.bestBid() - offset;
	} else {
		if (this._lowestAsk === null) {
			throw new Error('Unable to place post bid when there are no asks');
		}
		price = this.bestAsk() + offset;
	}
	order.price = price;
	this.limit(order);
};

//////////////////////////////////////
// Book introspection
//////////////////////////////////////

OrderBook.prototype.allBidLimits = function() {
	return this._allLimits(this._bidTree);
};

OrderBook.prototype.allAskLimits = function() {
	return this._allLimits(this._askTree);
};

OrderBook.prototype._allLimits = function(tree) {
	var limits = [];
	tree.each(function(limit) {
		limits.push(limit);
	});
	return limits;
};

//////////////////////////////////////
// Execution
//////////////////////////////////////

OrderBook.prototype._execute = function() {
	var bidHead = this._highestBid.getHead(),
			askHead = this._lowestAsk.getHead();

	var min = function(a, b) { return a < b ? a : b; };
	var crossSize = min(bidHead.getAvailableShares(), askHead.getAvailableShares());
	
	// Execute the trade at the bid price, for crossSize shares
	if (this._highestBid.fill(crossSize)) {
		this._postProcessBid(bidHead);
	}
	if (this._lowestAsk.fill(crossSize)) {
		this._postProcessAsk(askHead);
	}
};

OrderBook.prototype._postProcessBid = function(bid) {
	delete this._orders[bid.id];
	if (this._highestBid.isEmpty()) {
		this._bidTree.remove(this._highestBid);
		this._highestBid = this._bidTree.max();
	}			
};

OrderBook.prototype._postProcessAsk = function(ask) {
	delete this._orders[ask.id];
	if (this._lowestAsk.isEmpty()) {
		this._askTree.remove(this._lowestAsk);			
		this._lowestAsk = this._askTree.min();
	}
};

exports.OrderBook = OrderBook;