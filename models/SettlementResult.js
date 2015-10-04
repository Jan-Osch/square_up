var uuid4 = require('UuidHelper').uuid4;

function SettlementResult(identities) {
    this.uuid = uuid4();
    this.identities = identities;
    this.valuesToPaidBack = this.createTwoDimensionalArray(identities.length, 0);
    this.values
}

SettlementResult.prototype.addItem = function (item) {
    var that = this;
    var costPerIdentity = Math.floor(item.price / item.identitiesToPay.length);
};


