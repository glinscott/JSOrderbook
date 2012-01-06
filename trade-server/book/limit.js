var assert = require('assert');

////////////////////////////////////////////////////////////////////////////
// Limit
//
// Represents a single price point for orders.  Stores orders in FIFO
// fashion, so the first order when we match the price wins.
////////////////////////////////////////////////////////////////////////////
function Limit(price) {
	this.price = price;
	this.totalVolume = 0;
	this.ordersHead = null;
	this.ordersTail = null;
}

Limit.prototype.addOrder = function(order) {
	if (this.ordersHead === null) {
		assert.equal(this.ordersTail, null);
		
		this.ordersHead = order;
		this.ordersTail = order;
		return;
	}
	
	assert.notEqual(this.ordersTail, null);
	
	this.ordersTail.nextOrder = order;
	order.prevOrder = this.ordersTail;
};

Limit.prototype.removeOrder = function(order) {
	var prev = order.prevOrder,
			next = order.nextOrder;
	
	if (prev !== null) {
		prev.nextOrder = next;
	}
	if (next !== null) {
		next.prevOrder = prev;
	}
	
	if (order === this.ordersHead) {
		this.ordersHead = next;
	}
	if (order == this.ordersTail) {
		this.ordersTail = prev;
	}
};

exports.Limit = Limit;