const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const { Schema, model } = mongoose

const userSchema = new Schema({
    __v: { type: Number, select: false}, // 隐藏
    name: { type: String, required: true}, // 姓名
    password: { type: String, required: true, select: false}, // 密码 select:false，代表返回值不返回
    age: { type: Number, default: 0, required: false, select: false}, // 年龄
    avatar_url: { type: String }, // 头像
    gender: { type: String, enum: ['male', 'female'], default: 'male', required: true }, // 性别 枚举类型
    headline: { type: String }, // 一句话介绍
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false}, // 居住地 字符串数组
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false }, // 行业
    employments: { // 职业
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 公司或者组织名称
            job: { type: Schema.Types.ObjectId, ref: 'Topic' } // 职位
        }],
        select: false
    },
    educations: { // 教育
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic'}, // 学校或机构名称
            major: { type: Schema.Types.ObjectId, ref: 'Topic' }, // 专业
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 学历 ['高中及以下', '大专', '本科', '硕士', '博士及以上']
            entrance_year: { type: Number }, // 入学年份
            graduation_year: { type: Number }, // 毕业年份
        }],
        select: false
    },
    following: { // 关注
        type: [{
            type: Schema.Types.ObjectId, // 用户id，Schema提供的特殊类型
            ref: 'User', // 代表该id和用户关联
        }],
        select: false
    },
    followingTopics: { // 关注话题
        type: [{
            type: Schema.Types.ObjectId, // 用户id，Schema提供的特殊类型
            ref: 'Topic', // 代表该id和话题关联
        }],
        select: false
    }
})

// 参数一：文档集合名称；参数二：Schema
module.exports = model('User', userSchema)