/**
 * 利用内存数据库，实现用户的增删改查
 * 缺点：重启后数据失效
 */
const db = [{name: "李雷"}]

class UsersCtl {
    find(ctx) {
        // ctx.set('Allow', 'GET, POST')
        ctx.body = db
    }
    findById(ctx){
        ctx.body = db[ctx.params.id]
    }
    create(ctx){
        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }
    update(ctx){
        db[ctx.params.id] = ctx.request.body
        ctx.body = ctx.request.body
    }
    delete(ctx){
        db.splice(ctx.params.id, 1)
        ctx.status = 204
    }
}

module.exports = new UsersCtl()