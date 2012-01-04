var Tree = require('bintrees').RBTree;

function OrderBook() {
	var compareLimit = function(l1, l2) {
		return l1.price - l2.price;
	};
	
	this.bidTree = new Tree(compareLimit);
	this.askTree = new Tree(compareLimit);
	this.lowestBid = null;
	this.lowestAsk = null;
}

//////////////////////////////////////
// Core
//////////////////////////////////////

// Limit Order
// Places an order at a given price.  Can be a bid or ask.
OrderBook.prototype.limit = function(order) {
	
};

// Cancels the given order, removing it from the book.
OrderBook.prototype.cancel = function(orderId) {
	
};

// Returns the best bid price
OrderBook.prototype.bestBid = function() {
	
};

// Returns the best ask price
OrderBook.prototype.bestAsk = function() {
	
};

//////////////////////////////////////
// Advanced Order Types
//////////////////////////////////////

// Market Order - executes immediately at the best price possible.
// Returns the id of the executed order.
OrderBook.prototype.market = function(order) {
};

// Replaces the given orderId, with newOrder
OrderBook.prototype.replace = function(orderId, newOrder) {
	
};

// Adds an order that is guaranteed to add liquidity to the market.  Prices
// the order at the best price + offset
OrderBook.prototype.post = function(order, offset) {
	
};