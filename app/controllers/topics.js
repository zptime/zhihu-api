const Topic = require('../models/topics')
const User = require('../models/users')

class TopicsCtl {
    async find(ctx) { // 获取话题列表
        // limit(10)：代表返回的数据数量为10。
        // skip(10)：代表跳过10条数据，即从第11条数据开始返回
        const { per_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) -1 // 页码：字符串转数字
        const perPage = Math.max(per_page * 1, 1) // 每页数目：Math.max(避免出现第0页)
        ctx.body = await Topic
            // .find({ name: 'QQ' })精确查询；new RegExp(ctx.query.q)模糊查询，将关键字转为正则表达式
            .find({ name: new RegExp(ctx.query.q) })
            .limit(perPage)
            .skip(page * perPage)
    }
    async findById(ctx) { // 根据id获取话题信息
        const { fields } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const topic = await Topic.findById(ctx.params.id).select(selectFields)
        if(!topic){
            ctx.throw(404, '话题不存在')
        }
        ctx.body = topic
    }
    async create(ctx) { // 创建话题
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const { name } = ctx.request.body
        const repeatedTopic = await Topic.findOne({ name })
        if(repeatedTopic) {
            ctx.throw(409, '话题已存在')
        } 
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }
    async delete(ctx) { // 删除话题
        await Topic.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }
    async update(ctx) { // 修改话题信息
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if(!topic) {
            ctx.throw(404, '话题不存在')
        }
        ctx.body = topic
    }
    async checkTopicExist(ctx, next) { // 判断话题是否存在
        const topic = await Topic.findById(ctx.params.id)
        if(!topic) {
            ctx.throw(404, '话题不存在')
        }
        await next()
    }
    async listTopicFollowers(ctx) { // 获取话题粉丝列表，即关注话题的用户列表
        const users = await User.find({ followingTopics: ctx.params.id })
        ctx.body = users
    }
}

module.exports = new TopicsCtl()