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
	
	var order3 = createOrder(Order.OrderTypes.Ask, 16, 10);
	var id3 = book.limit(order3);
	
	assert.equal(book.bestBid(), 15);
	assert.equal(book.bestAsk(), 16);
	
	var order4 = createOrder(Order.OrderTypes.Ask, 14, 6);
	var id4 = book.limit(order4);
	
	assert.equal(book.bestBid(), Price.NoBid);
	assert.equal(book.bestAsk(), 14);
}

testBasics();