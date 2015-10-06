var _ = require('underscore'),
    uuid4 = require('./../UuidHelper.js').uuid4,
    round = require('./../RoundingHelper.js').round;


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

    this.calculate();
}

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
 * Calculates and saves how much each Identity paid more than it should.
 * Also increments that.totalOverpaid.
 */
Item.prototype.calculateOverpaidProportions = function () {
    var that = this;
    that.proportionsOverpaid = {};
    var total = 0;
    var overpaid;
    var totalOverpaid = 0;
    var pricePerIdentity = round(that.price / that.identitiesToPay.length);
    _.forEach(that.valuesPaid, function (valuePaid, uuidPaid) {
        if (uuidPaid in that.identitiesToPay) {
            overpaid = valuePaid - pricePerIdentity;
        }
        else {
            console.log(uuidPaid, 'not in', that.identitiesPaid);
            console.log(that.identitiesPaid.indexOf(uuidPaid));
            overpaid = valuePaid;
        }
        if (overpaid > 0) {
            that.proportionsOverpaid[uuidPaid] = overpaid
        }
        totalOverpaid += overpaid;
        total += valuePaid;
    });
    _.forEach(that.proportionsOverpaid, function (valueOverpaid, uuidOverpaid) {
        that.proportionsOverpaid[uuidOverpaid] = valueOverpaid / totalOverpaid;
    });

    //TODO implement error throwing when Item.valuesPaid do not sum up to Item.price
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