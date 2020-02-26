const Router = require('koa-router')
const jwt = require('koa-jwt')

// 前缀实现
const router = new Router({ prefix: '/topics'})
const { 
    find, findById, create, update, delete: del,
} = require('../controllers/topics')

const { secret } = require('../config')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, update)
router.delete('/:id', auth, del) // 一般不用，关联性强，删除可能出问题

module.exports = router