const Router = require('koa-router')
// const jwtwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')

// 前缀实现
const router = new Router({ prefix: '/users'})
const { 
    find, findById, create, update, delete: del, login, checkOwner,
    listFollowing, listFollowers, checkUserExist, follow, unfollow,
} = require('../controllers/users')

const { secret } = require('../config')

// 第三方认证koa-jwt
const auth = jwt({ secret })

// 自定义认证实现
// const auth = async (ctx, next) => {
//     const { authorization = '' } = ctx.request.header // =''：设置默认值，防止undefined时，replace函数报错
//     const token = authorization.replace('Bearer ', '')

//     // 将所有错误均抛成401-未认证错误，message可能为未提供token，或者token不合法等等
//     try {
//         // verify函数可能会报各种错误
//         const user = jwtwebtoken.verify(token, secret)
//         // ctx.state：约定俗成放置用户相关的信息
//         ctx.state.user = user
//     } catch(err) {
//         ctx.throw(401, err.message)
//     }
//     await next() // 执行之后的中间件
// }

// 获取用户列表
router.get('/', find)
// 获取单个用户信息
router.get('/:id', findById)
// 新增用户
router.post('/', create)
// 全部替换
// router.put('/:id', update)
// 修改用户信息（局部替换）
router.patch('/:id', auth, checkOwner, update)
// 删除用户：只能删除自己，需要加入授权逻辑。整体逻辑：验证--授权--操作（更新，删除）
router.delete('/:id', auth, checkOwner, del)
// 登录
router.post('/login', login)
// 获取关注人列表
router.get('/:id/following', listFollowing)
// 获取粉丝列表
router.get('/:id/followers', listFollowers)
// 关注：每个请求都携带token，可以知道具体是谁，不需要传当前用户id了。/following/:id（被关注人的id）
router.put('/following/:id', auth, checkUserExist, follow)
// 取消关注
router.delete('/following/:id', auth, checkUserExist, unfollow)

module.exports = router