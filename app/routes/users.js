const Router = require('koa-router')
const jwtwebtoken = require('jsonwebtoken')

// 前缀实现
const router = new Router({ prefix: '/users'})
const { 
    find, findById, create, update,
    delete: del, login, checkOwner
} = require('../controllers/users')

const { secret } = require('../config')

const auth = async (ctx, next) => {
    const { authorization = '' } = ctx.request.header // =''：设置默认值，防止undefined时，replace函数报错
    const token = authorization.replace('Bearer ', '')

    // 将所有错误均抛成401-未认证错误，message可能为未提供token，或者token不合法等等
    try {
        // verify函数可能会报各种错误
        const user = jwtwebtoken.verify(token, secret)
        // ctx.state：约定俗成放置用户相关的信息
        ctx.state.user = user
    } catch(err) {
        ctx.throw(401, err.message)
    }
    await next() // 执行之后的中间件
}

router.get('/', find)

router.get('/:id', findById)

router.post('/', create)

// 全部替换
// router.put('/:id', update)

// 局部替换
router.patch('/:id', auth, checkOwner, update)

// 删除是能删除自己，不能删除别人的，需要加入授权逻辑
// 整体逻辑：验证--授权--操作（更新，删除）
router.delete('/:id', auth, checkOwner, del)

router.post('/login', login)

module.exports = router