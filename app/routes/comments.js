const Router = require('koa-router')
const jwt = require('koa-jwt')

// 三级嵌套路由
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })
const {
    create, delete: del , find, findById, update,
    checkCommentExist, checkCommentator,
} = require('../controllers/comments')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkCommentExist, findById)
router.patch('/:id', auth, checkCommentExist, checkCommentator, update)
router.delete('/:id', auth, checkCommentExist, checkCommentator, del)

module.exports = router