var assert = require('assert');
var Limit = require('../book/limit');
var Order = require('../book/order');

var orderId = 0;
function createOrder(type, numShares) {
	return new Order.Order(orderId++, type, numShares, 0);
}

function testLimitBasics() {
	var testLimit = new Limit.Limit(100);
	var order1 = createOrder(Order.OrderTypes.Bid, 10);
	testLimit.addOrder(order1);
	assert.equal(testLimit.getHead(), order1);
	assert.equal(testLimit.getTotalVolume(), 10);
	
	var order2 = createOrder(Order.OrderTypes.Bid, 15);
	testLimit.addOrder(order2);
	assert.equal(testLimit.getHead(), order1);
	assert.equal(testLimit.getTotalVolume(), 25);
	
	testLimit.removeOrder(order1);
	assert.equal(testLimit.getHead(), order2);
	assert.equal(testLimit.getTotalVolume(), 15);
	
	testLimit.removeOrder(order2);
	assert.equal(testLimit.getHead(), null);
	assert.equal(testLimit.getTotalVolume(), 0);
}

testLimitBasics(); 