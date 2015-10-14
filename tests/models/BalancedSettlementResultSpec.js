describe('BalancedSettlementResult', function () {
    var BalancedSettlementResult,
        balancedSettlementResult;

    beforeEach(function () {
        BalancedSettlementResult = require('../../source/models/BalancedSettlementResult').BalancedSettlementResult;
        balancedSettlementResult = undefined;
    });

    it('Module is defined', function () {
        expect(BalancedSettlementResult).toBeDefined();
    });

    it('computeSumValuesToPayForUuid works as expected', function () {
        var mockSettlementResult = {
            valuesToPayForIdentity: {
                'identity_A': {
                    'item_1': {
                        'identity_B': 15,
                        'identity_C': 50
                    },
                    'item_2': {
                        'identity_D': 20,
                        'identity_C': 15
                    }
                }
            }
        };
        balancedSettlementResult = new BalancedSettlementResult(mockSettlementResult);
        var expected = {uuid: 'identity_A', value: 100};
        var actual = balancedSettlementResult.computeSumValuesToPayForUuid('identity_A');
        expect(balancedSettlementResult).toBeDefined();
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });
    it('computeSumValuesToBePaid works as expected', function () {
        var mockSettlementResult = {
            valuesToBePaidForIdentity: {
                'identity_A': {
                    'item_1': {
                        'identity_B': 30,
                        'identity_C': 50
                    },
                    'item_2': {
                        'identity_D': 20,
                        'identity_C': 80
                    }
                }
            }
        };
        balancedSettlementResult = new BalancedSettlementResult(mockSettlementResult);
        var expected = {uuid: 'identity_A', value: 180};
        var actual = balancedSettlementResult.computeSumValuesToBePaid('identity_A');
        expect(balancedSettlementResult).toBeDefined();
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });

    it('computeSumValuesToBePaid works as expected', function () {
        var mockSettlementResult = {
            valuesToPayForIdentity: {
                'identity_A': {
                    'item_1': {
                        'identity_C': 10
                    }
                },
                'identity_B': {
                    'item_3': {
                        'identity_C': 15,
                        'identity_A': 20
                    },
                    'item_2': {
                        'identity_A': 25
                    }
                },
                'identity_C': {
                    'item_1': {
                        'identity_B': 50
                    }
                }
            },
            valuesToBePaidForIdentity: {
                'identity_A': {
                    'item_2': {
                        'identity_B': 25
                    },
                    'item_3': {
                        'identity_C': 20
                    }
                },
                'identity_B': {
                    'item_1': {
                        'identity_C': 50
                    }
                },
                'identity_C': {
                    'item_1': {
                        'identity_A': 10
                    },
                    'item_3': {
                        'identity_B': 15
                    }
                }
            }
        };
        balancedSettlementResult = new BalancedSettlementResult(mockSettlementResult);
        var expectedValueToBePaidA = {uuid: 'identity_A', value: 45};
        var expectedValueToBePaidB = {uuid: 'identity_B', value: 50};
        var expectedValueToBePaidC = {uuid: 'identity_C', value: 25};

        var expectedValueToPayA = {uuid: 'identity_A', value: 10};
        var expectedValueToPayB = {uuid: 'identity_B', value: 60};
        var expectedValueToPayC = {uuid: 'identity_C', value: 50};

        expect(balancedSettlementResult).toBeDefined();
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });
});