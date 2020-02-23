/**
 * 利用内存数据库，实现用户的增删改查
 * 缺点：重启后数据失效
 */
const db = [{
    name: "李雷"
}]

class UsersCtl {
    find(ctx) {
        // 模拟500错误：Internal Server Error
        // a.b
        // ctx.set('Allow', 'GET, POST')
        ctx.body = db
    }
    findById(ctx) {
        // 制造412错误：先决条件失败
        // * 1 ：字符串类型转为数字
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
        }
        ctx.body = db[ctx.params.id * 1]
    }
    create(ctx) {
        // 参数校验：不满足条件，自动返回422错误码及详细信息
        ctx.verifyParams({
            name: { type:'string', required: true },
            age: { type: 'number', required: false }
        })

        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }
    update(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
        }
        ctx.verifyParams({
            name: { type:'string', required: true },
            age: { type: 'number', required: false }
        })

        db[ctx.params.id * 1] = ctx.request.body
        ctx.body = ctx.request.body
    }
    delete(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412, '先决条件失败：id大于或者等于数组长度了')
        }

        db.splice(ctx.params.id * 1, 1)
        ctx.status = 204
    }
}

module.exports = new UsersCtl()