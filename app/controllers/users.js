/**
 * 利用真实数据库，实现用户的增删改查
 */
const User = require('../models/users')
const jwtwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

class UsersCtl {
    async find(ctx) {
        ctx.body = await User.find()
    }
    async findById(ctx) {
        const { fields } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        // const user = await User.findById(ctx.params.id).select('+educations +business')
        const user = await User.findById(ctx.params.id).select(selectFields)
        if(!user){
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async create(ctx) {
        // 参数校验：不满足条件，自动返回422错误码及详细信息
        ctx.verifyParams({
            name: { type:'string', required: true },
            password: { type: 'string', require: true}
        })

        // 保证用户唯一性
        const { name } = ctx.request.body
        const repeatedUser = await User.findOne({ name })
        if(repeatedUser){
            ctx.throw(409, '用户已存在')
        }

        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    // 自定义授权实现
    async checkOwner(ctx, next){
        if(ctx.params.id !== ctx.state.user._id){
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async update(ctx) {
        ctx.verifyParams({
            name: { type:'string', required: false },
            password: { type: 'string', required: false},
            avatar_url: { type: 'string', required: false},
            gender: { type: 'string', required: false},
            headline: { type: 'string', required: false},
            locations: { type: 'array', itemType: 'string', required: false},
            business: { type: 'string', required: false},
            employments: { type: 'array', itemType: 'object', required: false},
            educations: { type: 'array', itemType: 'object', required: false},
        })

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if(!user){
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async delete(ctx) {
        const user = await User.findByIdAndDelete(ctx.params.id)
        if(!user){
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204
    }
    async login(ctx){
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const user = await User.findOne(ctx.request.body)
        if(!user){
            ctx.throw(401, '用户名或密码不正确')
        }

        const { _id, name } = user
        const token = jwtwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' }) // 过期时间，1天
        ctx.body = { token }

    }
}

/**
 * 利用内存数据库，实现用户的增删改查
 * 缺点：重启后数据失效
 */
// const db = [{
//     name: "李雷"
// }]

// class UsersCtl {
//     find(ctx) {
//         // 模拟500错误：Internal Server Error
//         // a.b
//         // ctx.set('Allow', 'GET, POST')
//         ctx.body = db
//     }
//     findById(ctx) {
//         // 制造412错误：先决条件失败
//         // * 1 ：字符串类型转为数字
//         if (ctx.params.id * 1 >= db.length) {
//             ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
//         }
//         ctx.body = db[ctx.params.id * 1]
//     }
//     create(ctx) {
//         // 参数校验：不满足条件，自动返回422错误码及详细信息
//         ctx.verifyParams({
//             name: { type:'string', required: true },
//             age: { type: 'number', required: false }
//         })

//         db.push(ctx.request.body)
//         ctx.body = ctx.request.body
//     }
//     update(ctx) {
//         if (ctx.params.id * 1 >= db.length) {
//             ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
//         }
//         ctx.verifyParams({
//             name: { type:'string', required: true },
//             age: { type: 'number', required: false }
//         })

//         db[ctx.params.id * 1] = ctx.request.body
//         ctx.body = ctx.request.body
//     }
//     delete(ctx) {
//         if (ctx.params.id * 1 >= db.length) {
//             ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
//         }

//         db.splice(ctx.params.id * 1, 1)
//         ctx.status = 204
//     }
// }

module.exports = new UsersCtl()