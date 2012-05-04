var assert = require('assert');

////////////////////////////////////////////////////////////////////////////
// Limit
//
// Represents a single price point for orders.  Stores orders in FIFO
// fashion.
////////////////////////////////////////////////////////////////////////////
function Limit(price) {
	this._price = price;
	this._totalVolume = 0;
	this._ordersHead = null;
	this._ordersTail = null;
}

Limit.prototype.getPrice = function() {
	return this._price;
};

Limit.prototype.getTotalVolume = function() {
	return this._totalVolume;
};

Limit.prototype.getHead = function() {
	return this._ordersHead;
};

Limit.prototype.getTail = function() {
	return this._ordersTail;
}

Limit.prototype.isEmpty = function() {
	return this._ordersHead === null;
};

// Execute a trade against the head order
// Returns true if the head order has been totally satisfied as a result
// Returns false if the head order remains on the book
Limit.prototype.fill = function(size) {
	this._ordersHead.fill(size);
	this._totalVolume -= size;
	assert.ok(this._totalVolume >= 0);
	
	if (this._ordersHead.getAvailableShares() === 0) {
		this.removeOrder(this._ordersHead);
		return true;
	}
	
	return false;
};

Limit.prototype.addOrder = function(order) {
	if (order.isBooked()) {
		throw new Error('Order has already been added');
	}
	if (order.price !== this.getPrice()) {
		throw new Error('Order not booked against correct Limit');
	}
	
	order.book(this);

	if (this._ordersHead === null) {
		assert.equal(this._ordersTail, null);
		assert.equal(this._totalVolume, 0);
		
		this._ordersHead = order;
		this._ordersTail = order;
	
		this._totalVolume += order.numShares;
		return;
	}
	
	assert.notEqual(this._ordersTail, null);
	
	if (this._ordersTail.orderType !== order.orderType) {
		throw new Exception('Order types must match for limits');
	}
	
	this._ordersTail.nextOrder = order;
	order.prevOrder = this._ordersTail;
	this._ordersTail = order;
	
	this._totalVolume += order.getAvailableShares();
};

Limit.prototype.removeOrder = function(order) {
	var prev = order.prevOrder,
			next = order.nextOrder;
	
	if (order.getParentLimit() !== this) {
		throw new Error('Attempting to remove Order from incorrect Limit');		
	}

	if (prev !== null) {
		prev.nextOrder = next;
	}
	if (next !== null) {
		next.prevOrder = prev;
	}

	this._totalVolume -= order.getAvailableShares();
	
	if (order === this._ordersHead) {
		this._ordersHead = next;
	}
	if (order === this._ordersTail) {
		this._ordersTail = prev;
	}
};

exports.Limit = Limit;