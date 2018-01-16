const router = require('express').Router()
const controller = require('../controllers').stories

router.get('/', controller.index)
router.get('/:id', controller.show)
router.post('/', controller.create)
router.put('/:id', controller.update)

module.exports = router