var assert = require('assert');
var Limit = require('../book/limit');
var Order = require('../book/order');

var orderId = 0;
function createOrder(type, numShares) {
	return new Order.Order(orderId++, type, 100, numShares, 0);
}

exports.testAddRemove = function() {
	var testLimit = new Limit.Limit(100);
	var order1 = createOrder(Order.OrderTypes.Bid, 10);
	assert.equal(order1.isBooked(), false);
	testLimit.addOrder(order1);
	assert.equal(testLimit.getHead(), order1);
	assert.equal(testLimit.getTotalVolume(), 10);
	assert.equal(order1.isBooked(), true);
	
	var order2 = createOrder(Order.OrderTypes.Bid, 15);
	testLimit.addOrder(order2);
	assert.equal(testLimit.getHead(), order1);
	assert.equal(testLimit.getTail(), order2);
	assert.equal(testLimit.getTotalVolume(), 25);
	
	testLimit.removeOrder(order1);
	assert.equal(testLimit.getHead(), order2);
	assert.equal(testLimit.getTotalVolume(), 15);
	
	testLimit.removeOrder(order2);
	assert.equal(testLimit.getHead(), null);
	assert.equal(testLimit.getTotalVolume(), 0);
}

function createDefaultLimit() {
	var testLimit = new Limit.Limit(100);
	var orders = [];
	orders[0] = createOrder(Order.OrderTypes.Ask, 10);
	orders[1] = createOrder(Order.OrderTypes.Ask, 10);
	orders[2] = createOrder(Order.OrderTypes.Ask, 10);
	testLimit.addOrder(orders[0]);
	testLimit.addOrder(orders[1]);
	testLimit.addOrder(orders[2]);
	return {orders:orders, limit:testLimit};	
}

exports.testRemoveMiddle = function() {
	var t = createDefaultLimit();
	t.limit.removeOrder(t.orders[1]);
	assert.equal(t.limit.getHead(), t.orders[0]);
	assert.equal(t.limit.getTotalVolume(), 20);
}

exports.testRemoveAdd = function() {
	var t = createDefaultLimit();
	t.limit.removeOrder(t.orders[2]);
	assert.equal(t.limit.getTotalVolume(), 20);
	var order = createOrder(Order.OrderTypes.Ask, 10);
	t.limit.addOrder(order);
	assert.equal(t.limit.getTotalVolume(), 30);
}

exports.testAddOrderTwice = function() {
	var t = createDefaultLimit();
	assert.throws(function() {
		t.limit.addOrder(t.orders[0]);
	});
}