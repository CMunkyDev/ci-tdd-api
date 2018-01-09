let Chai = require('chai')
let expect = Chai.expect

let headlines = require('../models').headlines
console.log(headlines)
describe('Headlines Model', function () {
    it(`Should have an 'all' method`, function () {
        expect(headlines.all).to.be.ok
    })
    it(`Should have a 'one' method`, function () {
        expect(headlines.one).to.be.ok
    })
    it(`Should have a 'create' method`, function () {
        expect(headlines.create).to.be.ok
    })
    it(`Should have an 'update' method`, function () {
        expect(headlines.update).to.be.ok
    })
    it(`Should have a 'delete' method`, function () {
        expect(headlines.delete).to.be.ok
    })
})