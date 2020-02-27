const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const { Schema, model } = mongoose

const questionSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true}, // 标题
    description: { type: String }, // 描述
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false } // 提问者
})

module.export = model('Question', questionSchema)