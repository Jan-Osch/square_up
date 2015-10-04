var _ = require('underscore'),
    uuid4 = require('UuidHelper').uuid4;

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

    //TODO calculate proportions
    //TODO calculate remainders
    //TODO calculate returns (remainders * proportions)
    //TODO implement separate class for rounding values
    this.calculateValuesToPayBack();
}

Item.prototype.calculateValuesToPayBack = function () {
    var that = this;
    var pricePerIdentity = Math.floor(that.price / that.identitiesToPay.length);
    var result = {};
    var partial;
    var currentUuid;
    var remainder;


    _.each(that.identitiesToPay, function (identityToPay) {
            currentUuid = identityToPay.uuid;
            result[currentUuid] = {};

            if (identityToPay in that.identitiesPayed) {
                remainder = that.valuesPayed[currentUuid] - pricePerIdentity;
            }
            else {
                remainder = pricePerIdentity;
            }
            _.each(that.valuesPayed, function(value, uuid){

            })

        }
    )

};


module.export = Item;
