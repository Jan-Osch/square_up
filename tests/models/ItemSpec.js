describe('Item', function () {
    var Item,
        item;

    beforeEach(function () {
        item = undefined;
    });

    it('is defined as a package', function () {
        Item = require('../../source/models/Item.js').Item;
        expect(Item).toBeDefined();
    });

    it('new instance is created and uuid added', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B'];
        var mockIdentitiesToPay = ['A', 'B'];
        var mockValuesPaid = {
            'A': 80,
            'B': 20
        };
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        expect(item).toBeDefined();
        expect(item.uuid).toBeDefined();
    });

    it('calculates proportionsPaid correctly', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C'];
        var mockIdentitiesToPay = ['A', 'B'];
        var valueA = 33;
        var valueB = 33;
        var valueC = 34;
        var mockValuesPaid = {
            'A': valueA,
            'B': valueB,
            'C': valueC
        };
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculatePaidProportions();
        expect(item.proportionsPaid).toBeDefined();
        expect(Object.keys(item.proportionsPaid).length).toEqual(3);
        expect(item.proportionsPaid['A']).toBeDefined();
        expect(item.proportionsPaid['A']).toEqual(valueA / mockPrice);
        expect(item.proportionsPaid['B']).toBeDefined();
        expect(item.proportionsPaid['B']).toEqual(valueB / mockPrice);
        expect(item.proportionsPaid['C']).toBeDefined();
        expect(item.proportionsPaid['C']).toEqual(valueC / mockPrice);
    });

    it('calculates remainders correctly case 1', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C'];
        var mockIdentitiesToPay = ['A', 'B'];
        var valueA = 33;
        var valueB = 60;
        var valueC = 7;
        var mockValuesPaid = {
            'A': valueA,
            'B': valueB,
            'C': valueC
        };
        var expectedToPayPerIdentity = 50;
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateRemainderToPay();
        expect(item.remaindersToPay).toBeDefined();
        expect(Object.keys(item.remaindersToPay).length).toEqual(2);
        expect(item.remaindersToPay['A']).toEqual(expectedToPayPerIdentity - valueA);
        expect(item.remaindersToPay['B']).toEqual(valueB - mockIdentitiesPaid);
    });
});