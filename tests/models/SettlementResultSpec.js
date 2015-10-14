describe('SettlementResult', function () {
    var SettlementResult = require('../../source/models/SettlementResult').SettlementResult;
    var settlementResult;
    beforeEach(function () {
        settlementResult = undefined;
    });
    it('module loads correctly', function () {
        expect(SettlementResult).toBeDefined();
    });
    it('constructor works correctly', function () {
        settlementResult = new SettlementResult([]);
        expect(settlementResult).toBeDefined();
        expect(settlementResult.uuid).toBeDefined();
    });
    it('addItem works for single Item', function () {
        settlementResult = new SettlementResult([]);
        var mock1 = {
            valuesToPay: {
                'A': {
                    'B': 10,
                    'C': 20
                }
            }
        };
        settlementResult.addItem(mock1);
        expect(settlementResult.valuesToPay).toBeDefined();
        expect(settlementResult.valuesToPay['A']).toBeDefined();
        expect(settlementResult.valuesToPay['A']['B']).toEqual(10);
        expect(settlementResult.valuesToPay['A']['C']).toEqual(20);
    });
    it('addItem works for two Items', function () {
        settlementResult = new SettlementResult([]);
        var mock1 = {
            valuesToPay: {
                'A': {
                    'B': 10,
                    'C': 20
                }
            }
        };
        var mock2 = {
            valuesToPay: {
                'A': {
                    'B': 20
                },
                'C': {
                    'B': 15
                },
                'F': {
                    'G': 40
                }
            }
        };
        settlementResult.addItem(mock1);
        settlementResult.addItem(mock2);
        expect(settlementResult.valuesToPay).toBeDefined();
        expect(settlementResult.valuesToPay['A']['B']).toEqual(30);
        expect(settlementResult.valuesToPay['A']['C']).toEqual(20);
        expect(settlementResult.valuesToPay['C']['B']).toEqual(15);
        expect(settlementResult.valuesToPay['F']['G']).toEqual(40);
    });
    it('clearSettlement cleans Values that Two Identities have to pay each other', function () {
        settlementResult = new SettlementResult([]);
        settlementResult.valuesToPay = {
            'A': {
                'B': 30
            },
            'B': {
                'A': 15,
                'C': 10
            }
        };
        settlementResult.clearSettlement();
        expect(settlementResult.valuesToPay).toBeDefined();
        expect(settlementResult.valuesToPay['A']['B']).toEqual(15);
        expect(settlementResult.valuesToPay['B']['A']).not.toBeDefined();
        expect(settlementResult.valuesToPay['B']['C']).toEqual(10);
    });
    it('valuesToBePaidPerItem is computed correctly when items are added', function () {
        var mockItem1 = {
            uuid: '1',
            valuesToPay: {
                'A': {
                    'B': 15
                },
                'C': {
                    'B': 20
                }
            }
        };
        var mockItem2 = {
            uuid: '2',
            valuesToPay: {
                'A': {
                    'B': 10
                },
                'D': {
                    'B': 5
                }
            }
        };
        var expected = {
            '1': {
                'A': 15,
                'C': 20
            },
            '2': {
                'A': 10,
                'D': 5
            }
        };
        settlementResult = new SettlementResult([mockItem1, mockItem2]);

        expect(settlementResult.valuesToBePaidPerItem).toBeDefined();
        expect(settlementResult.valuesToBePaidPerItem['B']).toBeDefined();
        expect(settlementResult.valuesToBePaidPerItem['B']).toEqual(expected);
    });
    it('valuesToBePayForIdentity is computed correctly when items are added', function () {
        var mockItem1 = {
            uuid: '1',
            valuesToPay: {
                'A': {
                    'B': 15,
                    'C': 10
                },
                'C': {
                    'B': 20
                }
            }
        };
        var mockItem2 = {
            uuid: '2',
            valuesToPay: {
                'A': {
                    'B': 10,
                    'D' :104
                },
                'D': {
                    'B': 5
                }
            }
        };
        var expected = {
            '1': {
                'B': 15,
                'C': 10
            },
            '2': {
                'B': 10,
                'D': 104
            }
        };
        settlementResult = new SettlementResult([mockItem1, mockItem2]);

        expect(settlementResult.valuesToPayPerItem).toBeDefined();
        expect(settlementResult.valuesToPayPerItem['A']).toBeDefined();
        expect(settlementResult.valuesToPayPerItem['A']).toEqual(expected);
    })


});