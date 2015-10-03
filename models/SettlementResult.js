function SettlementResult(identities) {
    this.identities = identities;
    this.result = this.createTwoDimensionalArray(identities.length, 0);
}

SettlementResult.prototype.createTwoDimensionalArray = function (size, value) {
    if (!value) {
        value = 0;
    }
    var result = [];
    var temp;
    for (var i = 0; i < size; i++) {
        temp = [];
        for (var j = 0; j < size; j++) {
            temp.push(value);
        }
        result.push(temp);
    }
    return result;
};

SettlementResult.prototype.addItem = function (item) {
    var that = this;
    var costPerIdentity = Math.floor(item.price / item.identitiesToPay.length);

};


