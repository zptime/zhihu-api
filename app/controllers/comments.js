const Comment = require('../models/comments')

class CommentsCtl {
    async create(ctx) { // 新增
        ctx.verifyParams({
            content: { type: 'string', required: true },
            rootCommentId: { type: 'string', required: false },
            replyTo: { type: 'string', required: false },
        })
        const commentator = ctx.state.user._id
        const { questionId, answerId } = ctx.params
        const comment = await new Comment({...ctx.request.body, commentator, questionId, answerId }).save()
        ctx.body = comment
    }
    async delete(ctx) { // 删除
        await Comment.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }
    async find(ctx) { // 查询列表
        const { per_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(per_page * 1, 1)
        const q = new RegExp(ctx.query.q)
        const { questionId, answerId } = ctx.params
        const { rootCommentId } = ctx.query // 可选参数，放在query中，如果存在，就是查二级评论
        ctx.body = await Comment
            .find({ content: q, questionId, answerId, rootCommentId }) // 精准匹配问题
            .limit(perPage).skip(page * perPage)
            .populate('commentator replyTo')
    }
    async findById(ctx) { // 查询详细信息
        const { fields } = ctx.query
        const selectfields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const comment = await Comment.findById(ctx.params.id).select(selectfields).populate('commentator')
        ctx.body = comment
    }
    async update(ctx) { // 修改
        ctx.verifyParams({
            content: { type: 'string', required: false },
        })
        const { content } = ctx.request.body
        await ctx.state.comment.updateOne({ content })
        ctx.body = ctx.state.comment
    }
    async checkCommentator(ctx, next) { // 检查评论者
        const { comment } = ctx.state
        if(comment.commentator.toString() !== ctx.state.user._id){
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async checkCommentExist(ctx, next){ // 检查是否存在
        const comment = await Comment.findById(ctx.params.id).select('+commentator')
        if(!comment) {
            ctx.throw(404, '评论不存在')
        }
        // 只有在删改查的时候，才检查此逻辑；赞和踩的时候不需要
        if(ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此评论')
        }
        if(ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
            ctx.throw(404, '该答案下没有此评论')
        }
        ctx.state.comment = comment
        await next()
    }
}

module.exports = new CommentsCtl()