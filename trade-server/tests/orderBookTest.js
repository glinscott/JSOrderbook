var assert = require('assert');
var Order = require('../book/order');
var OrderBook = require('../book/orderBook');
var Price = require('../book/price').Price;

var orderId = 0;
function createOrder(type, price, numShares) {
	return new Order.Order(orderId++, type, price, numShares, 0);
}

function placeOrder(book, order, bestBid, bestAsk, expectedBidVol, expectedAskVol) {
	var id = book.limit(order),
			newBidVol = 0,
			newAskVol = 0,
			i,
			bidLimits,
			askLimits;
	
	assert.equal(book.bestBid(), bestBid);
	assert.equal(book.bestAsk(), bestAsk);
	
	// TOOD: use underscore for this
	bidLimits = book.allBidLimits();
	for (i = 0; i < bidLimits.length; i++) {
		newBidVol += bidLimits[i].getTotalVolume();
	}
	assert.equal(newBidVol, expectedBidVol);
	
	askLimits = book.allAskLimits();
	for (i = 0; i < askLimits.length; i++) {
		newAskVol += askLimits[i].getTotalVolume();
	}
	assert.equal(newAskVol, expectedAskVol);
	
	return {id: id, order: order};
}

function testBasics() {
	var book = new OrderBook.OrderBook();
	
	placeOrder(book, createOrder(Order.OrderTypes.Bid, 15, 10), 15, Price.NoAsk, 10, 0);
	placeOrder(book, createOrder(Order.OrderTypes.Ask, 12, 5), 15, Price.NoAsk, 5, 0);
	placeOrder(book, createOrder(Order.OrderTypes.Ask, 16, 10), 15, 16, 5, 10);
	placeOrder(book, createOrder(Order.OrderTypes.Ask, 14, 6), Price.NoBid, 14, 0, 11);
}

testBasics();