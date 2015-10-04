var uuid4 = require('UuidHelper').uuid4,
    _ = require('underscore'),
    SettlementResult = require('./SettlementResult.js').SettlementResult;

/**
 * Class that holds references to Items and Identities and groups them
 * @field name {String}
 * @field identites {Array}
 * @field items {Array}
 */


/**
 * @param name {String}
 * @constructor
 */
function Settlement(name) {
    this.uuid = uuid4();
    this.name = name;
    this.identities = [];
    this.items = [];
}


/**
 * Adds Item to Settlement, adds Items Identities into Identities(array based set)
 * @param item {Item}
 */
Settlement.prototype.addItem = function (item) {
    var that = this;
    that.items.push(item);
    that.identities = _.union(that.identities, item.identitiesPaid, item.identitiesToPay);
};

Settlement.prototype.removeItemAtIndex = function (index) {
    this.items.splice(index, 1);
};

Settlement.prototype.addIdentity = function (identity) {
    this.identities.push(identity);
};

Settlement.prototype.removeIdentityAtIndex = function (index) {
    this.identities.splice(index, 1);
};

/**
 * Creates an instance of SettlementResult from current Items
 * @returns {SettlementResult} result for current state of Settlement
 */
Settlement.prototype.createResult = function () {
    var that = this;
    return new SettlementResult(that.items);
};

exports.Settlement = Settlement;


