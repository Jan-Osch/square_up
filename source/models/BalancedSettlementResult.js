var _ = require('underscore'),
    SettlementResult = require('SettlementResult').SettlementResult;

/**
 * Class for holding a SettlementResult that has the lowest number of possible transactions to equalize
 * @constructor
 */
function BalancedSettlementResult() {
    SettlementResult.apply(this, arguments);
    this.valuesToPayArray = [];
    this.valuesToBePaidArray = [];
    this.balancedResult = {};
    this.balance();
}

BalancedSettlementResult.prototype.balance = function () {
    var that = this;
    that.createArraysOfValues();
    that.assignLowestToPayValueToBiggestToBePaidValue();
};

BalancedSettlementResult.prototype.assignLowestToPayValueToBiggestToBePaidValue = function () {
    var that = this;

    while (that.valuesToPayArray.length > 0) {
        var smallestValueToPay = that.valuesToPayArray.shift();
        var currentUuidToPay = smallestValueToPay.uuid;
        if (!that.balancedResult[currentUuidToPay]) {
            that.balancedResult[currentUuidToPay] = {};
        }

        var biggestValueToBePaid = that.valuesToBePaidArray.pop();
        var remainingValue = smallestValueToPay.value;

        while (remainingValue > biggestValueToBePaid.value) {
            var currentUuidToBePaid = biggestValueToBePaid.uuid;
            var currentValueToBePaid = biggestValueToBePaid.value;

            if (!that.balancedResult[currentUuidToPay][currentUuidToBePaid]) {
                that.balancedResult[currentUuidToPay][currentUuidToBePaid] = 0
            }
            that.balancedResult[currentUuidToPay][currentUuidToBePaid] += currentValueToBePaid;
            remainingValue -= currentValueToBePaid;
            biggestValueToBePaid = that.valuesToBePaidArray.pop();
        }
        var finalUuidToBePaid = biggestValueToBePaid.uuid;
        if (!that.balancedResult[currentUuidToPay][finalUuidToBePaid]) {
            that.balancedResult[currentUuidToPay][finalUuidToBePaid] = 0;
        }
        that.balancedResult[currentUuidToPay][finalUuidToBePaid] += remainingValue;
        biggestValueToBePaid.value -= remainingValue;
        if (biggestValueToBePaid.value > 0) {
            var position = _.sortedIndex(that.valuesToBePaidArray, biggestValueToBePaid, 'value');
            that.valuesToBePaidArray.splice(position, 0, biggestValueToBePaid);
        }
    }
};

BalancedSettlementResult.prototype.createArraysOfValues = function () {
    var that = this;
    _.forEach(that.allIdentities, function (uuid) {
        var totalToPay = 0;
        if (that.totalValuesToPay[uuid]) {
            totalToPay = that.totalValuesToPay[uuid]
        }
        var totalToBePaid = 0;
        if (that.totalValuesToBePaid[uuid]) {
            totalToBePaid = 0;
        }
        if (totalToBePaid > totalToPay) {
            that.valuesToBePaidArray.push({uuid: uuid, value: totalToBePaid - totalToPay})
        }
        else if (totalToPay < totalToBePaid) {
            that.valuesToPayArray.push({uuid: uuid, value: totalToPay - totalToBePaid})
        }
    }, that)
};

exports.BalancedSettlementResult = BalancedSettlementResult;