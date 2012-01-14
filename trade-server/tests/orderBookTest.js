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
		var id,
				newBidVol = 0,
				newAskVol = 0,
				i,
				bidLimits,
				askLimits;

		if (order.isMarket()) {
			id = book.market(order);
		} else if (order.isPost()) {
			id = book.post(order);
		} else {
			id = book.limit(order);
		}

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
	};
}

function testBasics() {
	var t = new TestHarness();
	
	t.placeOrder(createOrder(Order.OrderTypes.Bid, 15, 10), 15, Price.NoAsk, 10, 0);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 12, 5), 15, Price.NoAsk, 5, 0);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 16, 10), 15, 16, 5, 10);
	t.placeOrder(createOrder(Order.OrderTypes.Ask, 14, 6), Price.NoBid, 14, 0, 11);
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
testMarketOrder();