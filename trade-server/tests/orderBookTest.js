var assert = require('assert');
var Order = require('../book/order');
var OrderBook = require('../book/orderBook');
var Price = require('../book/price').Price;

var orderId = 0;
function createOrder(type, price, numShares) {
	return new Order.Order(orderId++, type, price, numShares, 0);
}

function TestHarness() {
	var book = new OrderBook.OrderBook();

	this.typeLimit = 0;
	this.typeMarket = 1;
	this.typePost = 2;
	this.typeReplace = 3;

	this.placeOrder = function(order, bestBid, bestAsk, expectedBidVol, expectedAskVol) {
		if (order.isMarket()) {
			book.market(order);
		} else if (order.isPost()) {
			book.post(order);
		} else {
			book.limit(order);
		}
		
		return this.verify(order, bestBid, bestAsk, expectedBidVol, expectedAskVol);
	};
	
	this.cancelOrder = function(orderId, bestBid, bestAsk, expectedBidVol, expectedAskVol) {
		book.cancel(orderId);
		
		return this.verify(null, bestBid, bestAsk, expectedBidVol, expectedAskVol);
	};
	
	this.verify = function(order, bestBid, bestAsk, expectedBidVol, expectedAskVol) {
		var newBidVol = 0,
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
		
		return order;
	};
}

function testBasics() {
	var t = new TestHarness();
	
	t.placeOrder(createOrder(Order.OrderTypes.Bid, 15, 10), 15, Price.NoAsk, 10, 0);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 12, 5), 15, Price.NoAsk, 5, 0);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 16, 10), 15, 16, 5, 10);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 14, 6), Price.NoBid, 14, 0, 11);
}

function testCancel() {
	var t = new TestHarness(),
			o;
	
	var setup = function() {
		var orders = [];
		orders.push(t.placeOrder(createOrder(Order.OrderTypes.Bid, 15, 10), 15, Price.NoAsk, 10, 0));
		orders.push(t.placeOrder(createOrder(Order.OrderTypes.Ask, 12, 5), 15, Price.NoAsk, 5, 0));
		orders.push(t.placeOrder(createOrder(Order.OrderTypes.Ask, 16, 10), 15, 16, 5, 10));
		return orders;
	};
	
	// Round 1, cancel in same order they were placed
	o = setup();
	t.cancelOrder(o[0].id, Price.NoBid, 16, 0, 10);
	assert.throws(function() {
		t.cancelOrder(o[1].id, Price.NoBid, 16, 0, 5);
	}, /not booked/, "Can't cancel an order that is no longer on the book");
	t.cancelOrder(o[2].id, Price.NoBid, Price.NoAsk, 0, 0);
	
	// Round 2, cancel in different order
	o = setup();
	t.cancelOrder(o[2].id, 15, Price.NoAsk, 5, 0);
	t.cancelOrder(o[0].id, Price.NoBid, Price.NoAsk, 0, 0);
}

function testMarketOrder() {
	var t = new TestHarness();
	
	t.placeOrder(createOrder(Order.OrderTypes.Bid, 15, 10), 15, Price.NoAsk, 10, 0);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 20, 10), 15, 20, 10, 10);
	t.placeOrder(createOrder(Order.OrderTypes.Market | Order.OrderTypes.Bid, 0, 8), 15, 20, 10, 2);
	t.placeOrder(createOrder(Order.OrderTypes.Market | Order.OrderTypes.Ask, 0, 8), 15, 20, 2, 2);
	t.placeOrder(createOrder(Order.OrderTypes.Market | Order.OrderTypes.Bid, 0, 6), Price.BestBid, Price.NoAsk, 6, 0);
}

testBasics();
testCancel();
testMarketOrder();