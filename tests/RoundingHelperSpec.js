describe('RoundingHelper', function () {
    var round = require('./RoundingHelper.js').round;
    it('function round is defined', function () {
        expect(round).toBeDefined();
    });
    it('rounds small values as expected', function () {
        var value = 0.1;
        var result = round(value);
        var expected = 0;
        expect(result).toEqual(expected);
    });
    it('rounds small values with a lot of digits', function () {
        var value = 0.1123123;
        var result = round(value);
        var expected = 0;
        expect(result).toEqual(expected);
    });
    it('rounds small values near 0.5', function () {
        var value = 0.4912;
        var result = round(value);
        var expected = 0;
        expect(result).toEqual(expected);
    });
    it('rounds small values above 0.5', function () {
        var value = 0.50003131;
        var result = round(value);
        var expected = 1;
        expect(result).toEqual(expected);
    })
});