function Price() {}

var bestAsk = 0;
var bestBid = 999999999999;

Price.prototype.NoBid = bestAsk - 1;
Price.prototype.NoAsk = bestBid + 1;

Price.prototype.BestBid = bestBid;
Price.prototype.BestAsk = bestAsk;

exports.Price = new Price();