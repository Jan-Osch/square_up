var _ = require('underscore'),
    uuid4 = require('./../UuidHelper.js').uuid4,
    round = require('./../RoundingHelper.js').round;


/**
 * Class for holding items in the Settlement
 * @field name {String}
 * @field price {Number}
 * @field identitiesPayed {Array} of Uuids
 * @field identitiesToPay {Array} of Uuids
 * @field valuesPaid {Object} a map <Uuid>:<Value>how much each Identity paid
 * @field remaindersToPay {Object} a map <Uuid>:<Value>how much each Identity has to pay in total
 * @field valuesToPay {Object} a map <Uuid>:<Uuid>:<Value>how much each Identity has to pay to each specific Identity
 * @field proportionsPaid{Object} a map <Uuid>:<Value>how much each of the items price each Identity paid
 */

/**
 * @param name {String}
 * @param price {Number} integer value of the item in smallest indivisible value in a Currency
 * @param identitiesPayed {Array}
 * @param identitiesToPay {Array}
 * @param valuesPayed {Object} a map <Uuid>:<Number>how much each identity paid
 * @constructor
 */
function Item(name, price, identitiesPayed, identitiesToPay, valuesPayed) {
    this.uuid = uuid4();
    this.name = name;
    this.price = price;
    this.identitiesPayed = identitiesPayed;
    this.identitiesToPay = identitiesToPay;
    this.valuesPaid = valuesPayed;
    this.remaindersToPay = {};
    this.valuesToPay = {};
    this.proportionsPaid = {};

    this.calculate();
}

/**
 * Calculates values that Identities have to return each other
 */
Item.prototype.calculate = function () {
    var that = this;
    that.calculatePaidProportions();
    that.calculateRemainderToPay();
    that.calculateValuesToPay();
};

/**
 * Calculates and saves proportion of how much each Identity paid of the items price
 */
Item.prototype.calculatePaidProportions = function(){
    var that = this;
    that.proportionsPaid = {};

    _.forEach(that.valuesPaid, function(valuePaid, uuidPaid){
        that.proportionsPaid[uuidPaid] = valuePaid / that.price;
    })

};

/**
 * Calculates and saves how much each Identity has to pay back in total
 */
Item.prototype.calculateRemainderToPay = function(){
    var that = this;
    that.remaindersToPay = {};
    var pricePerIdentity = round(that.price / that.identitiesToPay.length);
    _.forEach(that.identitiesToPay, function(uuidToPay){
        if (uuidToPay in that.identitiesPayed) {
            that.remaindersToPay[uuidToPay] = pricePerIdentity - that.valuesPaid[uuidToPay];
        }else{
            that.remaindersToPay[uuidToPay] = pricePerIdentity;
        }
    })
};

/**
 * Calculates and saves how much each Identity has to pay back to each Identity
 */
Item.prototype.calculateValuesToPay = function(){
    var that = this;
    that.valuesToPay = {};
    _.forEach(that.remaindersToPay, function(remainderToPay, uuidToPay){
        that.valuesToPay[uuidToPay] = {};

        _.forEach(that.proportionsPaid, function(proportionPaid, uuidPaid){
            that.valuesToPay[uuidToPay][uuidPaid] = round(remainderToPay * proportionPaid);
        })
    })
};

exports.Item = Item;