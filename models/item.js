var _ = require('underscore'),
    uuid4 = require('UuidHelper').uuid4,
    round = require('RoundingHelper').round;


/**
 * Class for holding items in the Settlement
 * @param name {String}
 * @param price {Number} integer value of the item in smallest indivisible value in a Currency
 * @param identitiesPayed {Array}
 * @param identitiesToPay {Array}
 * @param valuesPayed {Object} a map <uuid>:<number>how much each identity paid
 * @constructor
 */
function Item(name, price, identitiesPayed, identitiesToPay, valuesPayed) {
    this.uuid = uuid4();
    this.name = name;
    this.price = price;
    this.identitiesPayed = identitiesPayed;
    this.identitiesToPay = identitiesToPay;
    this.valuesPayed = valuesPayed;

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
 * Calculates
 */
Item.prototype.calculatePaidProportions = function(){
    var that = this;
    that.proportionsPaid = {};

    _.forEach(that.valuesPayed, function(valuePaid, uuidPaid){
        that.proportionsPaid[uuidPaid] = valuePaid / that.price;
    })

};

Item.prototype.calculateRemainderToPay = function(){
    var that = this;
    that.remaindersToPay = {};
    var pricePerIdentity = round(that.price / that.identitiesToPay.length);
    _.forEach(that.identitiesToPay, function(uuidToPay){
        if (uuidToPay in that.identitiesPayed) {
            that.remaindersToPay[uuidToPay] = pricePerIdentity - that.valuesPayed[uuidToPay];
        }else{
            that.remaindersToPay[uuidToPay] = pricePerIdentity;
        }
    })
};

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

module.export = Item;
