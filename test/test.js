'use strict';

var expect = require('chai').expect;
var kospr = require('../index');

describe('#kospr', function() {
    it('should show the Kospr version', function() {
        var result = kospr.version();
        expect(result).to.equal('v.0.1.0');
    }); 
    it('should show the Kospr power on', function() {
        var result = kospr.power_on();
        expect(result).to.equal(true);
    });
    it('should show the Kospr power off', function() {
        var result = kospr.power_off();
        expect(result).to.equal(false);
    });
    it('should show the Kospr restart', function() {
        var result = kospr.restart();
        expect(result).to.equal(true);
    });
    it('should show the Kospr status', function() {
        var result = kospr.status();
        expect(result).to.equal(true);
    });
});