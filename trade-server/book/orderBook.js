var Tree = require('bintrees').RBTree;
var Limit = require('./limit');

function OrderBook() {
	var compareLimit = function(l1, l2) {
		return l1.price - l2.price;
	};
	
	this._bidTree = new Tree(compareLimit);
	this._askTree = new Tree(compareLimit);
	this._highestBid = null;
	this._lowestAsk = null;
}

//////////////////////////////////////
// Core
//////////////////////////////////////

// Limit Order
// Places an order at a given price.  Can be a bid or ask.
OrderBook.prototype.limit = function(order) {
	var orderLimit, tree;
	
	if (order.isBid()) {
		tree = this._bidTree;
		if (this._highestBid < order.limit) {
			this._highestBid = order.limit;
		}
	} else if (order.isAsk()) {
		tree = this._askTree;
		if (this._lowestAsk > order.limit) {
			this._lowestAsk = order.limit;
		}
	} else {
		throw new Error('Order type must be bid or ask');
	}

	orderLimit = tree.find({price:order.limit});
	if (orderLimit === null) {
		orderLimit = new Limit.Limit(order.limit);
		tree.insert(orderLimit);
	}
	orderLimit.addOrder(order);
	
	while (this.bestBid() >= this.bestAsk()) {
		this._execute();
	}
	
	return order.id;
};

// Cancels the given order, removing it from the book.
OrderBook.prototype.cancel = function(orderId) {
	
};

// Returns the best bid (buying) price
OrderBook.prototype.bestBid = function() {
	return this._highestBid;
};

// Returns the best ask (selling) price
OrderBook.prototype.bestAsk = function() {
	return this._lowestAsk;
};

//////////////////////////////////////
// Advanced Order Types
//////////////////////////////////////

// Market Order - executes immediately at the best price possible.
// Returns the id of the executed order.
OrderBook.prototype.market = function(order) {
};

// Replaces the given orderId with newOrder
OrderBook.prototype.replace = function(orderId, newOrder) {
	
};

// Adds an order that is guaranteed to add liquidity to the market.  Prices
// the order at the best price + offset
OrderBook.prototype.post = function(order, offset) {
	
};

//////////////////////////////////////
// Execution
//////////////////////////////////////

OrderBook.prototype._execute = function(order) {
	
};

exports.OrderBook = OrderBook;