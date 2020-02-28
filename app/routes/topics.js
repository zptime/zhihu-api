const Router = require('koa-router')
const jwt = require('koa-jwt')

// 前缀实现
const router = new Router({ prefix: '/topics'})
const { 
    find, findById, create, update, delete: del,
    checkTopicExist, listTopicFollowers,
    listTopicQuestions,
} = require('../controllers/topics')

const { secret } = require('../config')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkTopicExist, findById)
router.patch('/:id', auth, checkTopicExist, update)
router.delete('/:id', auth, checkTopicExist, del) // 一般不用，关联性强，删除可能出问题
router.get('/:id/followers', checkTopicExist, listTopicFollowers) // 话题粉丝列表
router.get('/:id/questions', checkTopicExist, listTopicQuestions) // 话题的问题列表

module.exports = router