const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const questionSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true}, // 标题
    description: { type: String }, // 描述
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false }, // 提问者
    topics: { // 问题下面建话题，因为一个问题的话题是有限的，一般不会超过10个；而某个话题下的问题可能有成千上万个，如互联网。
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Topic'
        }],
        select: false
    }
}, { timestamps: true })

module.exports = model('Question', questionSchema)