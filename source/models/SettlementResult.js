var uuid4 = require('./../UuidHelper.js').uuid4,
    _ = require('underscore');

/**
 * Class for holding Settlement Result
 * @field uuid {Uuid}
 * @field valuesToPay {Object} a map <uuidToPay>:<uuidToBePaid>:<Value>
 * @field items {Array} array of Items
 */

/**
 *
 * @param items {Array} of Items
 * @constructor
 */
function SettlementResult(items) {
    this.uuid = uuid4();
    this.items = items;
    this.valuesToPay = {};
    this.valuesToPayPerItem = {};
    this.valuesToBePaidPerItem = {};
    this.allIdentities = [];
    this.identitiesToBePaid = [];
    this.identitiesToPay = [];
    this.totalValuesToPay = {};
    this.totalValuesToBePaid = {};
    this.calculateSettlementResult();
}

/**
 * Sums valuesToPay of all items. Then clears reciprocal values (when two Identities have to pay each other);
 */
SettlementResult.prototype.calculateSettlementResult = function () {
    var that = this;
    _.forEach(that.items, that.addItem, that);
    that.allIdentities = _.uniq(that.allIdentities);
    that.identitiesToBePaid = _.uniq(that.identitiesToBePaid);
    that.identitiesToPay = _.uniq(that.identitiesToBePaid);
};

/**
 * Adds a single item to SettlementResult, adding all Values to Pay to valuesToPay
 * @param item {Item}
 */
SettlementResult.prototype.addItem = function (item) {
    var that = this;
    that.addItemIdentities(item);
    _.forEach(item.valuesToPay, function (valueMap, uuidToPay) {
        if (!that.valuesToPay[uuidToPay]) {
            that.valuesToPay[uuidToPay] = {};
        }
        _.forEach(valueMap, function (value, uuidToBePaid) {

            //valuesToPay
            if (!that.valuesToPay[uuidToPay][uuidToBePaid]) {
                that.valuesToPay[uuidToPay][uuidToBePaid] = 0
            }
            that.valuesToPay[uuidToPay][uuidToBePaid] += value;

            //valuesToBePaidPerItem
            if (!that.valuesToBePaidPerItem[uuidToBePaid]) {
                that.valuesToBePaidPerItem[uuidToBePaid] = {};
            }
            if (!that.valuesToBePaidPerItem[uuidToBePaid][item.uuid]) {
                that.valuesToBePaidPerItem[uuidToBePaid][item.uuid] = {}
            }
            that.valuesToBePaidPerItem[uuidToBePaid][item.uuid][uuidToPay] = value;

            //valuesToPayPerItem
            if (!that.valuesToPayPerItem[uuidToPay]) {
                that.valuesToPayPerItem[uuidToPay] = {};
            }
            if (!that.valuesToPayPerItem[uuidToPay][item.uuid]) {
                that.valuesToPayPerItem[uuidToPay][item.uuid] = {};
            }
            that.valuesToPayPerItem[uuidToPay][item.uuid][uuidToBePaid] = value;

            //total values
            if (!that.totalValuesToBePaid[uuidToBePaid]) {
                that.totalValuesToBePaid[uuidToBePaid] = 0;
            }
            that.totalValuesToBePaid[uuidToBePaid] += value;
            if (!that.totalValuesToPay[uuidToPay]) {
                that.totalValuesToPay[uuidToPay] = 0;
            }
            that.totalValuesToPay += value;
        })
    });
};

SettlementResult.prototype.addItemIdentities = function (item) {
    var that = this;
    that.identitiesToPay.push(item.identitiesToPay);
    that.identitiesToBePaid.push(item.identitiesPaid);
    that.allIdentities.push(item.identitiesToPay);
    that.allIdentities.push(item.identitiesPaid);
};

exports.SettlementResult = SettlementResult;


