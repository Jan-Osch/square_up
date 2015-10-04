describe('Item' ,function(){
   var Item,
       item;

    beforeEach(function(){
        item = undefined;
    });

    it('is defined as a package', function(){
        Item  = require('.././models/Item.js').Item;
        expect(Item).toBeDefined();
    });

    it('new instance is created and uuid added', function(){
        var mockName = 'name';
        var mockPrice = 100;
        var mockIdentitesPayed = ['A', 'B'];
        var mockIdentitesToPay = ['A', 'B'];
        var mockValuesPaid = {
            'A' : 80,
            'B' : 20
        };
        item = new Item()
    })
});