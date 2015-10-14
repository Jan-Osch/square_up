var _ = require('underscore'),
    SettlementResult = require('SettlementResult').SettlementResult;

function CleanedSettlementResult() {
    SettlementResult.apply(this, arguments);
    this.clearSettlement();
}

/**
 * If two identities have to pay each other it subtracts smaller value to pay from the higher.
 * If a value to pay is 0 then it is removed from the settlement result
 */
CleanedSettlementResult.prototype.clearSettlement = function () {
    var that = this;
    _.forEach(that.valuesToPay, function (valueMap, uuidToPay) {
        _.forEach(valueMap, function (value, uuidToBePaid) {

            if (uuidToBePaid in that.valuesToPay && uuidToPay in that.valuesToPay[uuidToBePaid]) {
                if (that.valuesToPay[uuidToBePaid][uuidToPay] > that.valuesToPay[uuidToPay][uuidToBePaid]) {
                    that.valuesToPay[uuidToBePaid][uuidToPay] -= that.valuesToPay[uuidToPay][uuidToBePaid];
                    delete that.valuesToPay[uuidToPay][uuidToBePaid];
                }
                else if (that.valuesToPay[uuidToBePaid][uuidToPay] < that.valuesToPay[uuidToPay][uuidToBePaid]) {
                    that.valuesToPay[uuidToPay][uuidToBePaid] -= that.valuesToPay[uuidToBePaid][uuidToPay];
                    delete that.valuesToPay[uuidToBePaid][uuidToPay];
                }
                else {
                    delete that.valuesToPay[uuidToBePaid][uuidToPay];
                    delete that.valuesToPay[uuidToPay][uuidToBePaid]
                }
            }
        })
    });
};

exports.CleanedSettlementResult = SettlementResult;