const Answer = require('../models/answers')

class AnswersCtl {
    async create(ctx) { // 新增
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const answerer = ctx.state.user._id
        const { questionId } = ctx.params
        const answer = await new Answer({...ctx.request.body, answerer, questionId }).save()
        ctx.body = answer
    }
    async delete(ctx) { // 删除
        await Answer.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }
    async find(ctx) { // 查询答案列表
        const { per_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        const answers = await Answer
            .find({ content: q, questionId: ctx.params.questionId }) // 精准匹配问题
            .limit(perPage)
            .skip(page * perPage)
        ctx.body = answers
    }
    async findById(ctx) { // 查询某个答案信息
        const { fields } = ctx.query
        const selectfields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const answer = await Answer.findById(ctx.params.id).select(selectfields).populate('answerer')
        if(!answer){
            ctx.throw(404, '答案不存在')
        }
        ctx.body = answer
    }
    async update(ctx) { // 修改
        ctx.verifyParams({
            content: { type: 'string', required: false },
        })
        await ctx.state.answer.update(ctx.request.body)
        ctx.body = ctx.state.answer
    }
    async checkAnswerer(ctx, next) { // 检查是否是回答者
        const { answer } = ctx.state
        if(answer.answerer.toString() !== ctx.state.user._id){
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async checkAnswerExist(ctx, next){ // 检查答案是否存在
        const answer = await Answer.findById(ctx.params.id).select('+answerer')
        if(!answer) {
            ctx.throw(404, '答案不存在')
        }
        // 只有在删改查答案的时候，才检查此逻辑（检验答案是否在该问题下）；赞和踩答案的时候不需要
        if(ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此答案')
        }
        ctx.state.answer = answer
        await next()
    }
}

module.exports = new AnswersCtl()