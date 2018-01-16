const Model = require('./model')('stories')
const CustomError = require('../tests/CustomError')

class StoriesModel extends Model {
    constructor () {
        super()
    }

    static one(id) {
        //input testing
        if (!Number.isInteger(parseFloat(id))) throw new CustomError('StoriesModel.one requires an integer as an argument.', 400)

        return super.one(id)
        //output testing
            .then(result => {
                if (!result) throw new CustomError(`No story with ID of ${id} in the stories table.`, 404)
                return result
            })
    }

    static create(body) {
        //input testing
        if (!arguments.length) throw new CustomError(`No body passed in to StoriesModel.create.`, 400)
        if (Array.isArray(body) || typeof body !== 'object') throw new CustomError(`StoriesModel.create must be passed an object, but it was passed a(n) ${Array.isArray(body) ? 'array' : typeof body}.`, 400)
        if (Object.keys(body).filter(key => key !== 'headline' && key !== 'content' && key !== 'author').length) throw new CustomError(`The story object passed in to StoriesModel.create must only have "headline" "content" and "author" keys`, 400)
        if (Object.values(body).filter(value => typeof value !== 'string').length) throw new CustomError(`The "headline" "content" and "author" keys in the object passed in to StoriesModel.create must all have string values`, 400)
        let headline = body.headline
        let content = body.content
        if (!headline || !content) throw new CustomError('Argument object passed in to StoriesModel.create must have content in both "headline" & "content" keys', 400)
        if (typeof headline !== 'string') throw new CustomError(`"headline" property in StoriesModel.create argument object must be a string, but was a ${typeof headline}`, 400)
        if (typeof content !== 'string') throw new CustomError(`"content" property in StoriesModel.create argument object must be a string, but was a ${typeof content}`, 400)

        return super.create(body)
    }

    static update(id, body) {
        if (!arguments.length) throw new CustomError('No arguments passed in to StoriesModel.update', 400)
        if (arguments.length < 2) throw new CustomError('Missing second argument (body/row) in StoriesModel.update', 400)
        if (!Number.isInteger(parseFloat(id))) throw new CustomError('StoriesModel.update requires an integer as its first argument.', 400)
        if (Array.isArray(body) || typeof body !== 'object') throw new CustomError(`StoriesModel.update must be passed an object as its second argument, but it was passed a(n) ${Array.isArray(body) ? 'array' : typeof body}.`, 400)
        if (Object.keys(body).filter(key => key !== 'headline' && key !== 'content' && key !== 'author').length) throw new CustomError(`The story object passed in to StoriesModel.update must only have "headline" "content" and "author" keys`, 400)
        if (Object.values(body).filter(value => typeof value !== 'string').length) throw new CustomError(`The "headline" "content" and "author" keys in the object passed in to StoriesModel.update must all have string values`, 400)

        return super.update(id, body)
    }

    static delete(id) {
        if (!Number.isInteger(parseFloat(id))) throw new CustomError('StoriesModel.delete requires an integer as an argument.', 400)

        return super.delete(id)
    }
}

module.exports = StoriesModel