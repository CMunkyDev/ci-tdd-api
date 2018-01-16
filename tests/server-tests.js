const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('GET /stories', function () {
    it ('succeeds', function () {
        return request(app)
            .get('/stories')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.stories).to.be.an('array')
                expect(response.body.stories.length).to.equal(2)
                expect(response.body.stories[0]).to.haveOwnProperty('headline')
                expect(response.body.stories[0]).to.haveOwnProperty('author')
                expect(response.body.stories[0]).to.haveOwnProperty('content')
            })
    })
})

describe('GET /stories/id', function () {
    it ('returns one story object', function () {
        return request(app)
            .get('/stories/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                expect(response.body.stories).to.be.an('object')
                expect(response.body.stories).to.haveOwnProperty('headline')
                expect(response.body.stories).to.haveOwnProperty('author')
                expect(response.body.stories).to.haveOwnProperty('content')
            })
    })
})

describe('POST /stories', function () {
    let postHeadline = 'POST test headline'
    let postAuthor = 'POST test author'
    let postContent = 'POST test content'
    it ('returns the created object, with a new id key', function () {
        return request(app)
            .post('/stories')
            .send({headline: postHeadline, author: postAuthor, content: postContent})
            .expect('Content-Type', /json/)
            .expect(201)
            .then(response => {
                expect(response.body.stories).to.be.an('object')
                expect(response.body.stories).to.haveOwnProperty('id')
                expect(response.body.stories).to.haveOwnProperty('headline')
                expect(response.body.stories.headline).to.be(postHeadline)
                expect(response.body.stories).to.haveOwnProperty('author')
                expect(response.body.stories.author).to.be(postAuthor)
                expect(response.body.stories).to.haveOwnProperty('content')
                expect(response.body.stories.content).to.be(postContent)
            })
    })
})