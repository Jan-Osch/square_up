describe('Identity', function(){
    var Identity,
        identity;
    beforeEach(function(){
        Identity = require('.././models/Identity.js').Identity;
        identity = undefined;
    });

    it('is defined as a package', function(){
        expect(Identity).toBeDefined();
    });

    it('constructor creates a valid instance', function(){
        var mockName = 'mock';
        identity = new Identity(mockName);
        expect(identity).toBeDefined();
        expect(identity instanceof Identity).toEqual(true);
        expect(identity.name).toEqual(mockName);
        expect(identity.uuid).toBeDefined();
        expect(typeof (identity.uuid )).toEqual('string');
    })
})