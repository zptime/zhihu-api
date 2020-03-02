const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const commentSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true}, // 内容
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false }, // 评论者，用户与评论（一对多）
    questionId: { type: String, require: true }, // 问题与评论（一对多关系）
    answerId: { type: String, require: true }, // 答案与评论（一对多关系）
})

module.exports = model('Comment', commentSchema)