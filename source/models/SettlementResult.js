var uuid4 = require('./../UuidHelper.js').uuid4,
    _ = require('underscore');

/**
 * Class for holding Settlement Result
 * @field uuid {Uuid}
 * @field settlementValuesToPay {Object} a map <uuidToPay>:<uuidToBePaid>:<Value>
 * @field items {Array} array of Items
 */

/**
 *
 * @param items {Array} of Items
 * @constructor
 */
function SettlementResult(items) {
    this.uuid = uuid4();
    this.settlementValuesToPay = {};
    this.items = items;
    this.calculateSettlementResult();
}

/**
 * Sums valuesToPay of all items. Then clears reciprocal values (when two Identities have to pay each other);
 */
SettlementResult.prototype.calculateSettlementResult = function () {
    var that = this;
    this.settlementValuesToPay = {}; //clean previous results
    _.forEach(that.items, that.addItem);
    that.clearSettlement();
};

/**
 * Adds a single item to SettlementResult, adding all Values to Pay to settlementValuesToPay
 * @param item {Item}
 */
SettlementResult.prototype.addItem = function (item) {
    var that = this;
    _.forEach(item.valuesToPay, function (valueMap, uuidToPay) {
        if (!(uuidToPay in that.settlementValuesToPay)) {
            that.settlementValuesToPay[uuidToPay] = {};
        }
        _.forEach(valueMap, function (value, uuidToBePaid) {
            if (uuidToBePaid in that.settlementValuesToPay[uuidToPay]) {
                that.settlementValuesToPay[uuidToPay][uuidToBePaid] += value;
            }
            else{
                that.settlementValuesToPay[uuidToPay][uuidToBePaid] = value;
            }
        })
    });
};

/**
 * If two identities have to pay each other it subtracts smaller value to pay from the higher.
 * If a value to pay is 0 then it is removed from the settlement result
 */
SettlementResult.prototype.clearSettlement = function () {
    var that = this;
    _.forEach(that.settlementValuesToPay, function (valueMap, uuidToPay) {
        _.forEach(valueMap, function (value, uuidToBePaid) {

            if (uuidToBePaid in that.settlementValuesToPay && uuidToPay in that.settlementValuesToPay[uuidToBePaid]) {
                if (that.settlementValuesToPay[uuidToBePaid][uuidToPay] > that.settlementValuesToPay[uuidToPay][uuidToBePaid]) {
                    that.settlementValuesToPay[uuidToBePaid][uuidToPay] -= that.settlementValuesToPay[uuidToPay][uuidToBePaid];
                    delete that.settlementValuesToPay[uuidToPay][uuidToBePaid];
                }
                else if (that.settlementValuesToPay[uuidToBePaid][uuidToPay] < that.settlementValuesToPay[uuidToPay][uuidToBePaid]) {
                    that.settlementValuesToPay[uuidToPay][uuidToBePaid] -= that.settlementValuesToPay[uuidToBePaid][uuidToPay];
                    delete that.settlementValuesToPay[uuidToBePaid][uuidToPay];
                }
                else {
                    delete that.settlementValuesToPay[uuidToBePaid][uuidToPay];
                    delete that.settlementValuesToPay[uuidToPay][uuidToBePaid]
                }

            }
        })
    });
};

exports.SettlementResult = SettlementResult;


