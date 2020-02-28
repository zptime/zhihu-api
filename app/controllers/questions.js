const Question = require('../models/quetions')
const User = require('../models/users')

class QuetionsCtl {
    async create(ctx) { // 新增
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false }
        })

        const question = await new Question({...ctx.request.body, questioner: ctx.state.user._id }).save()
        ctx.body = question
    }
    async delete(ctx) { // 删除
        await Question.findByIdAndRemove(ctx.query.id)
        ctx.throw(204)
    }
    async find(ctx) { // 查询问题列表
        const { per_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        const question = await Question
            // .find({ title: new RegExp(ctx.query.title)})
            .find({ $or: [{title: q }, {description: q}] }) // title和description均可以命中
            .limit(perPage)
            .skip(page * perPage)
        ctx.body = question
    }
    async findById(ctx) { // 查询某个问题信息
        const { fields } = ctx.query
        const selectfields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const question = await Question.findById(ctx.params.id).select(selectfields).populate('questioner')
        if(!question){
            ctx.throw(404, '问题不存在')
        }
        ctx.body = question
    }
    async update(ctx) { // 修改
        ctx.verifyParams({
            title: { type: 'string', required: false },
            description: { type: 'string', required: false }
        })

        // checkQuestionExist方法中会检查是否存在，重复了，可以共用
        // const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        // if(!question) {
        //     ctx.throw(404, '问题不存在')
        // }
        await ctx.state.question.update(ctx.request.body)
        ctx.body = ctx.state.quetion
    }
    async checkQuestioner(ctx, next) { // 检查是否是提问者，只有自己可以处理自己的
        const { question } = ctx.state
        if(question.questioner.toString() !== ctx.state.user._id){
            throw(403, '没有权限')
        }
        await next()
    }
    async checkQuestionExist(ctx, next){ // 检查问题是否存在
        const question = await Question.findById(ctx.params.id).select('+questioner')
        if(!question){
            ctx.throw(404, '问题不存在')
        }
        ctx.state.question = question
        await next()
    }
    async listQuestionFollowers(ctx) { // 问题的粉丝列表
        const users = await User.find({ followingQuestions: ctx.params.id })
        ctx.body = users
    }
}

module.exports = new QuetionsCtl()