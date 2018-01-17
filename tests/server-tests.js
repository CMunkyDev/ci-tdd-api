const args = require('yargs').argv
const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

if (args.nostack) {
    Error.stackTraceLimit = 0
}

const CustomError = require('./CustomError')

let db = require('../db/connection')

//Dummy testing data
let headline = "A$xKMfJ#@&*()K"
let content = "%SDFMLMAS!@#$%$^&*()1234567890[]{}<>?/,.`~|\\-_+=\'\" ksjdanf sdfns"
let author = "Jasdfkn G. Rsadkfjnaskjf"

function reseedStories() {
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
describe ('Route Tests' , function () {
    beforeEach(reseedStories)
    describe('GET /stories', function () {
        it('succeeds', function () {
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
        it('returns one story object', function () {
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
        it('returns the created object, with a new id key', function () {
            return request(app)
                .post('/stories')
                .send({ headline: postHeadline, author: postAuthor, content: postContent })
                .expect('Content-Type', /json/)
                .expect(201)
                .then(response => {
                    expect(response.body.stories).to.be.an('object')
                    expect(response.body.stories).to.haveOwnProperty('id')
                    expect(response.body.stories).to.haveOwnProperty('headline')
                    expect(response.body.stories.headline).to.equal(postHeadline)
                    expect(response.body.stories).to.haveOwnProperty('author')
                    expect(response.body.stories.author).to.equal(postAuthor)
                    expect(response.body.stories).to.haveOwnProperty('content')
                    expect(response.body.stories.content).to.equal(postContent)
                })
        })
    })

    describe('PUT /stories', function () {
        let putHeadline = 'PUT test headline'
        let putAuthor = 'PUT test author'
        let putContent = 'PUT test content'
        it('returns the updated object', function () {
            return request(app)
                .put('/stories/2')
                .send({ headline: putHeadline, content: putContent, author: putAuthor })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body.stories).to.be.an('object')
                    expect(response.body.stories).to.haveOwnProperty('id')
                    expect(response.body.stories.id).to.equal(2)
                    expect(response.body.stories).to.haveOwnProperty('headline')
                    expect(response.body.stories.headline).to.equal(putHeadline)
                    expect(response.body.stories).to.haveOwnProperty('author')
                    expect(response.body.stories.author).to.equal(putAuthor)
                    expect(response.body.stories).to.haveOwnProperty('content')
                    expect(response.body.stories.content).to.equal(putContent)
                })
        })
    })

    describe('DELETE /stories', function () {
        it('returns the deleted object', function () {
            return request(app)
                .delete('/stories/1')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    expect(response.body.stories).to.be.an('object')
                    expect(response.body.stories).to.haveOwnProperty('id')
                    expect(response.body.stories.id).to.equal(1)
                    expect(response.body.stories).to.haveOwnProperty('headline')
                    expect(response.body.stories.headline).to.equal(headline + 1)
                    expect(response.body.stories).to.haveOwnProperty('author')
                    expect(response.body.stories.author).to.equal(author + 1)
                    expect(response.body.stories).to.haveOwnProperty('content')
                    expect(response.body.stories.content).to.equal(content + 1)
                })
        })
        it('actually deletes the story with the passed id', function () {
            return request(app)
                .delete('/stories/1')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    return request(app)
                        .get('/stories')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .then(response => {
                            expect(response.body.stories).to.be.an('array')
                            expect(response.body.stories).to.have.length(1)
                            expect(response.body.stories[0]).to.haveOwnProperty('id')
                            expect(response.body.stories[0].id).to.equal(2)
                        })
                })
                
        })
    })
})