const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const topicSchema = new Schema({
    __v: { type: Number, select: false}, // 隐藏
    name: { type: String, required: true}, // 名称
    avatar_url: { type: String }, // 头像，话题图标
    introduction: { type: String, select: false }, // 简介
}, { timestamps: true })

module.exports = model('Topic', topicSchema)