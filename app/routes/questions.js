const Router = require('koa-router')
const jwt = require('koa-jwt')

const router = new Router({ prefix: '/questions' })
const {
    create, delete: del , find, findById, update,
    checkQuestionExist, listQuestionFollowers, checkQuestioner,
} = require('../controllers/questions')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkQuestionExist, findById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)
router.get('/:id/followers', checkQuestionExist, listQuestionFollowers)

module.exports = router