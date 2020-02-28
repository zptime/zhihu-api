/**
 * 利用真实数据库，实现用户的增删改查
 */
const jwtwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/quetions')
const { secret } = require('../config')

class UsersCtl {
    async find(ctx) {
        const { per_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) -1 // 页码：字符串转数字
        const perPage = Math.max(per_page * 1, 1) // 每页数目：Math.max(避免出现第0页)
        ctx.body = await User
            .find({ name: new RegExp(ctx.query.q) })
            .limit(perPage)
            .skip(page * perPage)
    }
    async findById(ctx) {
        const { fields } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        // const user = await User.findById(ctx.params.id).select('+educations +business')
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if(f === 'employments') {
                return 'employments.company employments.job'
            } else if(f === 'educations') {
                return 'educations.school educations.major'
            } else {
                return f
            }
        }).join(' ')
        const user = await User.findById(ctx.params.id).select(selectFields)
            .populate(populateStr)
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
    // 登录
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
    // 获取关注列表
    async listFollowing(ctx) {
        // select('+following')：获取到关注者列表，但全部是用户id。需要根据id来查询用户的具体信息
        // 定义时，使用了ref:'User'，添加populate('following)，可以获取到具体的用户信息
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if(!user){
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.following
    }
    // 获取粉丝列表
    async listFollowers(ctx) {
        const users = await User.find({ following: ctx.params.id })
        ctx.body = users
    }
    // 判断用户是否存在
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id)
        if(!user) {
            ctx.throw(404, '用户不存在')
        }
        await next()
    }
    // 关注功能
    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        // me.following里面的id是Scheme的字段类型，不能直接通过includes判断，需要转一下
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    // 取消关注功能
    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1){
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
    // 获取该用户话题列表
    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if(!user){
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.followingTopics
    }
    // 关注话题
    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    // 取消关注话题
    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1){
            me.followingTopics.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
    // 获取该用户的问题列表，提问者为指定用户
    async listQuestions(ctx) {
        const questions = await Question.find({ questioner: ctx.params.id })
        ctx.body = questions
    }
    // 问题的粉丝列表：获取关注该问题的用户列表
    async listFollowingQuestions(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingQuestions').populate('followingQuestions')
        if(!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.followingQuestions
    }
    // 关注问题
    async followQuestion(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingQuestions').populate('followingQuestions')
        if(!me.followingQuestions.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingQuestions.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    // 取消关注问题
    async unfollowQuestion(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followdingQuestions').populate('followingQuestions')
        const index = me.followingQuestions.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.followingQuestions.splice(index, 1)
            me.save()
        }
        ctx.status = 204
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