var assert = require('assert');
var Order = require('../book/order');
var OrderBook = require('../book/orderBook');
var Price = require('../book/price').Price;

var orderId = 0;
function createOrder(type, price, numShares) {
	return new Order.Order(orderId++, type, price, numShares, 0);
}

function testBasics() {
	var book = new OrderBook.OrderBook();
	
	var order1 = createOrder(Order.OrderTypes.Bid, 15, 10);
	var id1 = book.limit(order1);
	
	var order2 = createOrder(Order.OrderTypes.Ask, 12, 5);
	var id2 = book.limit(order2);

	assert.equal(book.bestBid(), 15);
	assert.equal(book.bestAsk(), Price.NoAsk);
}

testBasics();