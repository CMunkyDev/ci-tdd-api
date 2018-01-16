const router = require('express').Router()
const controller = require('../controllers').stories

router.get('/', controller.index)
router.get('/:id', controller.show)

module.exports = router