var Limit = require('../book/limit');
var Order = require('../book/order');

var orderId = 0;
function createOrder(type, numShares) {
	return new Order.Order(orderId++, type, numShares, 0);
};

var testLimit = new Limit.Limit(100);
testLimit.addOrder(createOrder(Order.OrderTypes.Bid, 10));
//var lowLimit = 