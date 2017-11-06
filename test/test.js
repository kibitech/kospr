'use strict';

var expect = require('chai').expect;
var kospr = require('../index');

describe('#kospr', function() {
    it('should show the Kospr version', function() {
        var result = kospr.version();
        expect(result).to.equal('v.0.1.0');
    });    
});