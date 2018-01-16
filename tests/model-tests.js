const args = require('yargs').argv
let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let expect = chai.expect

if (args.nostack) {
 Error.stackTraceLimit = 0
}

const CustomError = require('./CustomError')

let db = require('../db/connection')

let stories = require('../models').stories


//Dummy testing data
let headline = "A$xKMfJ#@&*()K"
let content = "%SDFMLMAS!@#$%$^&*()1234567890[]{}<>?/,.`~|\\-_+=\'\" ksjdanf sdfns"
let author = "Jasdfkn G. Rsadkfjnaskjf"

let validInputObj = { headline: 'test', content: 'test', author: 'test' }
let invalidlyTypedInputObjs = [
  { headline: 'test', content: 'test', author: 2 },
  { headline: 'test', content: 2, author: 'test' },
  { headline: 2, content: 'test', author: 'test' },
  { headline: 'test', content: undefined },
  { headline: undefined, content: 'test' },
  { headline: [], content: 'test', author: 'test' },
  { headline: 5.6, content: '3.6', author: 4.7 },
  { headline: 'test', content: [], author: 'test' },
  { headline: 'test', content: 'test', author: [] },
  { headline: {}, content: 'test', author: 'test' },
  { headline: 'test', content: {}, author: 'test' },
  { headline: 'test', content: 'test', author: {} }
]

let invalidlyNamedInputObjs = [
  { headloon: 'test', coontent: 'test', oother: 'test' },
  { headline: 'test', content: 'test', oother: 'test' },
  { headline: 'test', coontent: 'test', author: 'test' },
  { headloon: 'test', content: 'test', author: 'test' }
]

function reseedStories () {
  return db('stories').del()
    .then(() => {
      return db('stories').insert([
        {
          id: 1,
          headline: headline + 1,
          content: content + 1,
          author: author + 1
        },
        {
          id: 2,
          headline: headline + 2,
          content: content + 2,
          author: author + 2
        }
      ])
    })
}

describe ('StoriesModel', function () {
  beforeEach(reseedStories)

  describe ('.all()', function () {
    beforeEach(reseedStories)

    it('Should exist', function () {
      expect(stories.all).to.be.a('function')
    })

    //output tests
    it('Should return all records when .all is called', function () {
      return stories.all()
        .then(result => {
          expect(result.length).to.equal(2)
        })
    })
  })

  describe ('.one(integer)', function () {
    beforeEach(reseedStories)

    it('Should exist', function () {
      expect(stories.one).to.be.a('function')
    })

    //input tests
    it('Should throw a CustomError when no id is passed in', function () {
      expect(() => { stories.one() }).to.throw(CustomError)
    })

    it('Should throw a CustomError when the id passed is not an integer or a string representing an integer', function () {
      expect(() => { stories.one(4.2) }).to.throw(CustomError)
      expect(() => { stories.one('test') }).to.throw(CustomError)
    })

    //output tests
    it('Should throw a CustomError when the id passed does not exist in the table', function () {
      return expect(stories.one(22)).to.be.rejectedWith(Error)
    })

    it('Should return a story object when called with a valid id', function () {
      return stories.one(1)
        .then(result => {
          expect(result).to.be.an('object')
          expect(result).to.haveOwnProperty('headline')
          expect(result).to.haveOwnProperty('content')
          expect(result).to.haveOwnProperty('author')
        })
    })

    it('Should return the correct story when passed a valid id', function () {
      return stories.one(2)
        .then(result => {
          expect(result).to.be.an('object')
          expect(result.id).to.equal(2)
        })
    })
  })

  describe('.create(rowObject)', function () {
    beforeEach(reseedStories)

    it('Should exist', function () {
      expect(stories.create).to.be.a('function')
    })

    //input tests
    it('Should throw a CustomError when no argument is passed', function () {
      expect(() => stories.create()).to.throw(CustomError)
    })

    it('Should throw a CustomError when argument is not an object', function () {
      expect(() => stories.create('test')).to.throw(CustomError)
      expect(() => stories.create(42)).to.throw(CustomError)
      expect(() => stories.create(['test'])).to.throw(CustomError)
    })

    it(`Should throw a CustomError when the argument does not have the necessary properties (${'headline, content'})`, function () {
      expect(() => stories.create({})).to.throw(CustomError)
      expect(() => stories.create({content: 'test'})).to.throw(CustomError)
      expect(() => stories.create({headline: 'test'})).to.throw(CustomError)
    })

    it('Should throw a CustomError when the argument has extra properties', function () {
      expect(() => stories.create(Object.assign({id: 3}, validInputObj))).to.throw(CustomError)
      expect(() => stories.create(Object.assign({extra: {}}, validInputObj))).to.throw(CustomError)
    })

    it('Should throw a CustomError when the argument\'s properties have invalid values', function () {
      invalidlyTypedInputObjs.forEach(function (obj) {
        expect(() => stories.create(obj)).to.throw(CustomError)
      })
    })
  })

  describe('.update(id, rowObject)', function () {
    beforeEach(reseedStories)

    it('Should exist', function () {
      expect(stories.update).to.be.a('function')
    })

    //input tests
    it('Should throw a CustomError when no arguments are passed', function () {
      expect(() => stories.update()).to.throw(CustomError)
    })

    it('Should throw a CustomError when an argument is missing', function () {
      expect(() => stories.update(validInputObj)).to.throw(CustomError)
      expect(() => stories.update(2)).to.throw(CustomError)
    })

    it('Should throw a CustomError when the first argument is not an integer', function () {
      expect(() => stories.update([], validInputObj)).to.throw(CustomError)
      expect(() => stories.update({}, validInputObj)).to.throw(CustomError)
      expect(() => stories.update('B', validInputObj)).to.throw(CustomError)
      expect(() => stories.update(1.2, validInputObj)).to.throw(CustomError)
    })

    it('Should throw a CustomError when the second argument is not an object', function () {
      expect(() => stories.update(2, 'B')).to.throw(CustomError)
      expect(() => stories.update(2, 1)).to.throw(CustomError)
      expect(() => stories.update(2, [])).to.throw(CustomError)
    })

    it('Should throw a CustomError when the second argument has incorrect key names', function () {
      invalidlyNamedInputObjs.forEach(function (obj) {
        expect(() => stories.update(2, obj)).to.throw(CustomError)
      })
    })

    it('Should throw a CustomError when the second argument has keys with invalid values', function () {
      invalidlyTypedInputObjs.forEach(function (obj) {
        expect(() => stories.update(2, obj)).to.throw(CustomError)
      })
    })

  })

  describe('.delete(id)', function () {
    beforeEach(reseedStories)

    it('Should exist', function () {
      expect(stories.delete).to.be.a('function')
    })

    //input tests
    it('Should throw a CustomError when no argument is passed in', function () {
      expect(() => stories.delete()).to.throw(CustomError)
    })

    it('Should throw a CustomError when the argument is not an integer or a string representing an integer', function () {
      expect(() => stories.delete('test')).to.throw(CustomError)
      expect(() => stories.delete([])).to.throw(CustomError)
      expect(() => stories.delete({})).to.throw(CustomError)
      expect(() => stories.delete(1.2)).to.throw(CustomError)
    })
  })

  // it(`Should have a 'delete' method`, function () {
  //   expect(stories.delete).to.be.a('function')
  // })
})