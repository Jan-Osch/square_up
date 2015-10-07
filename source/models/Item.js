var _ = require('underscore'),
    uuid4 = require('./../UuidHelper.js').uuid4,
    round = require('./../RoundingHelper.js').round,
    assert = require('assert');


/**
 * Class for holding items in the Settlement
 * @field name {String}
 * @field price {Number}
 * @field identitiesPaid {Array} of Uuids
 * @field identitiesToPay {Array} of Uuids
 * @field valuesPaid {Object} a map <Uuid>:<Value>how much each Identity paid
 * @field remaindersToPay {Object} a map <Uuid>:<Value>how much each Identity has to pay in total
 * @field valuesToPay {Object} a map <Uuid>:<Uuid>:<Value>how much each Identity has to pay to each specific Identity
 * @field proportionsOverpaid{Object} a map <Uuid>:<Value>how much each of the items price each Identity paid
 */

/**
 * @param name {String}
 * @param price {Number} integer value of the item in smallest indivisible value in a Currency
 * @param identitiesPaid {Array}
 * @param identitiesToPay {Array}
 * @param valuesPayed {Object} a map <Uuid>:<Number>how much each identity paid
 * @constructor
 */
function Item(name, price, identitiesPaid, identitiesToPay, valuesPayed) {
    this.uuid = uuid4();
    this.name = name;
    this.price = price;
    this.identitiesPaid = identitiesPaid;
    this.identitiesToPay = identitiesToPay;
    this.valuesPaid = valuesPayed;
    this.remaindersToPay = {};
    this.valuesToPay = {};
    this.proportionsOverpaid = {};
    this.validateData();
    this.calculate();
}

Item.prototype.validateData = function () {
    var that = this;
    var total = 0;
    assert.equal(_.intersection(that.identitiesPaid, Object.keys(that.valuesPaid)).length, that.identitiesPaid.length, 'Item.identitiesPaid have to be the same as keys of Item.valuesPaid');
    _.forEach(this.valuesPaid, function (valuePaid, uuidPaid) {
        assert(valuePaid > 0, 'ValuePaid must be a positive integer');
        total += valuePaid;
    });
    assert.equal(total, that.price, "Item.valuesPaid have to sum up to price");
};

/**
 * Calculates values that Identities have to return each other
 */
Item.prototype.calculate = function () {
    var that = this;
    that.calculateOverpaidProportions();
    that.calculateRemainderToPay();
    that.calculateValuesToPay();
};

/**
 * Overpaid means how much and Identity paid more than it should.
 * Overpaid for an Identity that paid less than it should it 0 or does not exist.
 * This function calculates sums up overpaid for all Identities(totalOverpaid),
 * then for each Identity calculates proportion how much that identity overpaid to totalOverpaid
 */
Item.prototype.calculateOverpaidProportions = function () {
    var that = this;
    that.proportionsOverpaid = {};
    var overpaid;
    var totalOverpaid = 0;
    var pricePerIdentity = round(that.price / that.identitiesToPay.length);
    _.forEach(that.valuesPaid, function (valuePaid, uuidPaid) {
        if (that.identitiesToPay.indexOf(uuidPaid) >= 0) {
            overpaid = valuePaid - pricePerIdentity;
        }
        else {
            overpaid = valuePaid;
        }
        if (overpaid > 0) {
            that.proportionsOverpaid[uuidPaid] = overpaid;
            totalOverpaid += overpaid;
        }
    });
    _.forEach(that.proportionsOverpaid, function (valueOverpaid, uuidOverpaid) {
        that.proportionsOverpaid[uuidOverpaid] = valueOverpaid / totalOverpaid;
    });
};

/**
 * Calculates and saves how much each Identity has to pay back in total
 */
Item.prototype.calculateRemainderToPay = function () {
    var that = this;
    that.remaindersToPay = {};
    var pricePerIdentity = round(that.price / that.identitiesToPay.length);
    _.forEach(that.identitiesToPay, function (uuidToPay) {
        if (uuidToPay in that.valuesPaid) {
            var remainder = pricePerIdentity - that.valuesPaid[uuidToPay];
            if (remainder > 0) {
                that.remaindersToPay[uuidToPay] = remainder;
            }
        } else {
            that.remaindersToPay[uuidToPay] = pricePerIdentity;
        }
    })
};

/**
 * Calculates and saves how much each Identity has to pay back to each Identity
 */
Item.prototype.calculateValuesToPay = function () {
    var that = this;
    that.valuesToPay = {};
    _.forEach(that.remaindersToPay, function (remainderToPay, uuidToPay) {
        that.valuesToPay[uuidToPay] = {};

        _.forEach(that.proportionsOverpaid, function (proportionOverpaid, uuidPaid) {
            that.valuesToPay[uuidToPay][uuidPaid] = round(remainderToPay * proportionOverpaid);
        })
    })
};

exports.Item = Item;