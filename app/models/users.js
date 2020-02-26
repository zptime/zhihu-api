const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const userSchema = new Schema({
    __v: { type: Number, select: false}, // 隐藏
    name: { type: String, require: true},
    password: { type: String, require: true, select: true}, // select:false，代表返回值不返回
    age: { type: Number, default: 0, require: false, select: false}
})

// 参数一：文档集合名称；参数二：Schema
module.exports = model('User', userSchema)