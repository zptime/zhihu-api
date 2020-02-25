const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
    name: { type: String, require: true},
    age: { type: Number, default: 0, require: false}
})

// 参数一：文档集合名称；参数二：Schema
module.exports = model('User', userSchema)