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

    it('calculates proportionsOverpaid correctly', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C'];
        var mockIdentitiesToPay = ['A', 'B'];
        var valueA = 20;
        var valueB = 60;
        var valueC = 20;
        var mockValuesPaid = {
            'A': valueA,
            'B': valueB,
            'C': valueC
        };
        var expectedOverpaidB = 0.33;
        var expectedOverpaidC = 0.66;

        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateOverpaidProportions();
        expect(item.proportionsOverpaid).toBeDefined();
        console.log(item.proportionsOverpaid);
        expect(Object.keys(item.proportionsOverpaid).length).toEqual(2);
        expect(item.proportionsOverpaid['A']).toBeUndefined();
        expect(item.proportionsOverpaid['B']).toBeDefined();
        expect(item.proportionsOverpaid['B']).toEqual(expectedOverpaidB);
        expect(item.proportionsOverpaid['C']).toBeDefined();
        expect(item.proportionsOverpaid['C']).toEqual(expectedOverpaidC);
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
        expect(Object.keys(item.remaindersToPay).length).toEqual(1);
        expect(item.remaindersToPay['A']).toEqual(expectedToPayPerIdentity - valueA);
        expect(item.remaindersToPay['B']).not.toBeDefined()
    });

    it('calculates remainders correctly case 2', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C'];
        var mockIdentitiesToPay = ['A', 'B', 'D'];
        var valueA = 20;
        var valueB = 20;
        var valueC = 60;
        var mockValuesPaid = {
            'A': valueA,
            'B': valueB,
            'C': valueC
        };
        var expectedToPayPerIdentity = 33;
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateRemainderToPay();
        expect(item.remaindersToPay).toBeDefined();
        expect(Object.keys(item.remaindersToPay).length).toEqual(3);
        expect(item.remaindersToPay['A']).toEqual(expectedToPayPerIdentity - valueA);
        expect(item.remaindersToPay['B']).toEqual(expectedToPayPerIdentity - valueB);
        expect(item.remaindersToPay['D']).toEqual(expectedToPayPerIdentity);
        expect(item.remaindersToPay['C']).not.toBeDefined()
    });

    it('calculates remainders correctly case 3', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C'];
        var mockIdentitiesToPay = ['A', 'B'];
        var valueA = 33;
        var valueB = 33;
        var valueC = 33;
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
        expect(item.remaindersToPay['B']).toEqual(expectedToPayPerIdentity - valueB);
        expect(item.remaindersToPay['C']).not.toBeDefined()
    });

    it('calculates values to pay correctly case 1', function () {
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
        var expectedAToBValue = 15;
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateValuesToPay();
        expect(item.valuesToPay).toBeDefined();
        expect(Object.keys(item.remaindersToPay).length).toEqual(1);
        expect(item.valuesToPay['A']).toBeDefined();
        expect(Object.keys(item.valuesToPay['A']).length).toEqual(2);
        expect(item.valuesToPay['A']['B']).toBeDefined();
        expect(item.valuesToPay['A']['B']).toEqual(expectedAToBValue);

    });
});