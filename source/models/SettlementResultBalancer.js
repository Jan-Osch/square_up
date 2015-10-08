var _ = require('underscore');

function SettlementResultBalancer(settlementResult) {
    this.settlementResult = settlementResult;
    this.balance();
}


SettlementResultBalancer.prototype.balance = function () {

};

SettlementResultBalancer.prototype.createSortedValuesMap = function () {
    var that = this;
    that.sortedValuesMap = [];
    _.forEach(that.settlementResult.settlementValuesToPay, function(valueMap, uuidToPay ){
        _.forEach(valueMap, function(valueToPay,uuidToBePaid){
            that.sortedValuesMap.push({val: valueToPay, id:[uuidToPay, uuidToBePaid]})
        })
    });
    that.sortedValuesMap.sort(that.entryComparator);
};

SettlementResultBalancer.prototype.findIndexOfMatchingEntry = function (array, entry) {
    var start = array.indexOf(entry);
    for (var i = start; i < array.length; i++) {
        if (array[i].id[0] === entry.id[1] && array[i].id[1] == entry.id[0]) {
            return i;
        }
    }
    return -1;
};

SettlementResultBalancer.prototype.entryComparator = function (a, b) {
    var that = this;
    var result = that.valueComparator(a.val, b.val);
    if (result != 0) {
        return result;
    }
    result = that.identitesComparator(a.id[0], b.id[1]);
    if (result != 0) {
        return result;
    }
    return that.identitesComparator(a.id[1], b.id[0]);
};

SettlementResultBalancer.prototype.identitesComparator = function (identityA, identityB) {
    if (identityA > identityB) {
        return 1;
    }
    if (identityA === identityB) {
        return 0;
    }
    return -1;
};

SettlementResultBalancer.prototype.valueComparator = function (valueA, valueB) {
    if (valueA > valueB) {
        return 1;
    }
    if (valueA === valueB) {
        return 0;
    }
    return -1;
};




