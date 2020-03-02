const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const answerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true}, // 内容
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false }, // 回答者
    questionId: { // 问题与答案（一对多关系）
        type: String,
        require: true
    },
    voteCount: { type: Number, required: true, default: 0 }, // 赞、踩投票数
}, { timestamps: true })

module.exports = model('Answer', answerSchema)