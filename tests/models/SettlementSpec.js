describe('Settlement', function () {
    var Settlement = require('../../source/models/Settlement').Settlement;
    var settlement;
    beforeEach(function () {
        settlement = undefined
    });
    it('the module is defined', function () {
        expect(Settlement).toBeDefined();
    });
    it('creating an instance is successful', function () {
        var mock = 'mockName';
        settlement = new Settlement(mock);
        expect(settlement).toBeDefined();
        expect(settlement.uuid).toBeDefined();
        expect(settlement.name).toEqual(mock);
    });
    it('adding Item adds identities of this Item to identities', function () {
        var name = 'mockName';
        settlement = new Settlement(name);
        var mock1 = {
            identitiesPaid : ['A'],
            identitiesToPay : ['A', 'B']
        };
        var mock2 = {
            identitiesPaid : ['A'],
            identitiesToPay : ['A', 'C']
        };
        settlement.addItem(mock1);
        settlement.addItem(mock2);
        expect(settlement.identities.length).toEqual(3);
        expect(settlement.identities).toBeDefined();
        expect(settlement.identities).toContain('A');
        expect(settlement.identities).toContain('B');
        expect(settlement.identities).toContain('C');
    });
});