var round = require('../../source/RoundingHelper').round;
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

    it('Throws an error if negative value paid is given', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B'];
        var mockIdentitiesToPay = ['A', 'B'];
        var mockValuesPaid = {
            'A': -80,
            'B': 20
        };
        function wrapper(){
            new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        }
        expect(wrapper).toThrow('ValuePaid must be a positive integer')
    });

    it('Throws an error if valuesPaid do not sum up to price', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B'];
        var mockIdentitiesToPay = ['A', 'B'];
        var mockValuesPaid = {
            'A': 60,
            'B': 20
        };
        function wrapper(){
            new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        }
        expect(wrapper).toThrow('Item.valuesPaid have to sum up to price')
    });

    it('Throws an error if Identity from ValuesPaid is missing from identitiesPaid', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B'];
        var mockIdentitiesToPay = ['A', 'B'];
        var mockValuesPaid = {
            'B': 20
        };
        function wrapper(){
            new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        }
        expect(wrapper).toThrow('Item.identitiesPaid have to be the same as keys of Item.valuesPaid')
    });

    it('calculates proportionsOverpaid correctly case 1', function () {
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
        var expectedOverpaidB = 1/3;
        var expectedOverpaidC = 2/3;

        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateOverpaidProportions();
        expect(item.proportionsOverpaid).toBeDefined();
        expect(Object.keys(item.proportionsOverpaid).length).toEqual(2);
        expect(item.proportionsOverpaid['A']).toBeUndefined();
        expect(item.proportionsOverpaid['B']).toBeDefined();
        expect(item.proportionsOverpaid['B']).toEqual(expectedOverpaidB);
        expect(item.proportionsOverpaid['C']).toBeDefined();
        expect(item.proportionsOverpaid['C']).toEqual(expectedOverpaidC);
    });

    it('calculates proportionsOverpaid correctly case 2', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['B', 'C'];
        var mockIdentitiesToPay = ['A'];
        var valueB = 40;
        var valueC = 60;
        var mockValuesPaid = {
            'B': valueB,
            'C': valueC
        };
        var expectedOverpaidB = 4/10;
        var expectedOverpaidC = 6/10;

        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateOverpaidProportions();
        expect(item.proportionsOverpaid).toBeDefined();
        expect(Object.keys(item.proportionsOverpaid).length).toEqual(2);
        expect(item.proportionsOverpaid['A']).toBeUndefined();
        expect(item.proportionsOverpaid['B']).toBeDefined();
        expect(item.proportionsOverpaid['B']).toEqual(expectedOverpaidB);
        expect(item.proportionsOverpaid['C']).toBeDefined();
        expect(item.proportionsOverpaid['C']).toEqual(expectedOverpaidC);
    });


    it('calculates proportionsOverpaid correctly case 3', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A'];
        var mockIdentitiesToPay = ['A', 'B', 'C'];
        var valueA = 100;
        var mockValuesPaid = {
            'A': valueA
        };
        var expectedOverpaidA = 1;

        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateOverpaidProportions();
        expect(item.proportionsOverpaid).toBeDefined();
        expect(Object.keys(item.proportionsOverpaid).length).toEqual(1);
        expect(item.proportionsOverpaid['A']).toBeDefined();
        expect(item.proportionsOverpaid['A']).toEqual(expectedOverpaidA);
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
        var valueC = 34;
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
        var expectedAToBValue = round(17*10/17);
        var expectedAToCValue = round(17*7/17);
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateValuesToPay();
        expect(item.valuesToPay).toBeDefined();
        expect(Object.keys(item.valuesToPay).length).toEqual(1);
        expect(item.valuesToPay['A']).toBeDefined();
        expect(Object.keys(item.valuesToPay['A']).length).toEqual(2);
        expect(item.valuesToPay['A']['B']).toBeDefined();
        expect(item.valuesToPay['A']['B']).toEqual(expectedAToBValue);
        expect(item.valuesToPay['A']['C']).toEqual(expectedAToCValue);
    });

    it('calculates values to pay correctly case 2', function () {
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitiesPaid = ['A', 'B', 'C', 'D'];
        var mockIdentitiesToPay = ['A', 'B', 'C', 'D'];
        var valueA = 5;
        var valueB = 50;
        var valueC = 15;
        var valueD = 30;
        var mockValuesPaid = {
            'A': valueA,
            'B': valueB,
            'C': valueC,
            'D': valueD
        };
        var expectedAToBValue = round(20*25/30);
        var expectedAToDValue = round(20*5/30);
        var expectedCToBValue = round(10*25/30);
        var expectedCToDValue = round(10*5/30);
        item = new Item(mockName, mockPrice, mockIdentitiesPaid, mockIdentitiesToPay, mockValuesPaid);
        item.calculateValuesToPay();
        expect(item.valuesToPay).toBeDefined();
        expect(Object.keys(item.valuesToPay).length).toEqual(2);
        expect(item.valuesToPay['A']['B']).toEqual(expectedAToBValue);
        expect(item.valuesToPay['A']['D']).toEqual(expectedAToDValue);
        expect(item.valuesToPay['C']['B']).toEqual(expectedCToBValue);
        expect(item.valuesToPay['C']['D']).toEqual(expectedCToDValue);
    });
});