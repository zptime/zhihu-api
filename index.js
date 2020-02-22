const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser')

const app = new Koa();
const router = new Router();
// 前缀实现
const usersRouter = new Router({ prefix: '/users'});

/**
 * koa中间件与洋葱模型
 */
// app.use(async (ctx, next)=>{
//     console.log(1);
//     await next();
//     console.log(2);
//     ctx.body = 'Hello World, zhihu !';
// });

// app.use(async (ctx, next)=>{
//     console.log(3);
//     await next();
//     console.log(4);
// });

// app.use(async (ctx, next)=>{
//     console.log(5);
// });


/**
 * 自定义路由中间件
 */
// app.use(async (ctx, next)=>{
//     if(ctx.url === '/'){
//         ctx.body = '这是主页'
//     } else if(ctx.url === '/users') {
//         if(ctx.method === 'POST'){
//             ctx.body = '这是用户列表页'
//         } else if(ctx.method === 'GET') {
//             ctx.body = '这是创建用户'
//         } else {
//             ctx.status = 405
//         }
//     } else if(ctx.url.match(/\/users\/\w+/)) {
//         const userId = ctx.url.match(/\/users\/(\w+)/)[1]
//         ctx.body = `这是用户 ${userId}`
//     } else {
//         ctx.status = 404
//     }
// });


/**
 * koa-router实现路由
 * npm i koa-router --save
 */

// 多中间件用法
// const auth = async (ctx, next) => {
//     if(ctx.url !== '/users'){
//         ctx.throw(401)
//     }
//     await next()
// }

// router.get('/', (ctx) => {
//     ctx.set('Allow', 'GET, POST')
//     ctx.body = '<h1>这是主页</h1>'
// })

// // router.get('/users/:id', (ctx) => {
// //     ctx.body = `这是用户 ${ctx.params.id}`
// // })

// usersRouter.get('/', auth, (ctx) => {
//     ctx.body = '这是用户列表页'
// })

// usersRouter.post('/', auth, (ctx) => {
//     ctx.body = '创建用户'
// })

// // usersRouter.get('/:id', auth, (ctx) => {
// //     ctx.body = `这是用户 ${ctx.params.id}`
// // })

// usersRouter.get('/:id', (ctx) => {
//     ctx.body = `这是用户 ${ctx.params.id}`
// })

// usersRouter.put('/:id', (ctx) => {
//     ctx.body = { name: '李雷2'}
// })

// usersRouter.delete('/:id', (ctx) => {
//     ctx.status = 204
// })

/**
 * 利用内存数据库，实现用户的增删改查
 * 缺点：重启后数据失效
 */
const db = [{name: "李雷"}]

router.get('/', (ctx) => {
    ctx.body = '<h1>这是首页</h1>'
})

usersRouter.get('/', (ctx) => {
    ctx.set('Allow', 'GET, POST')
    ctx.body = db
})

usersRouter.post('/', (ctx) => {
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
})

usersRouter.get('/:id', (ctx) => {
    ctx.body = db[ctx.params.id]
})

usersRouter.put('/:id', (ctx) => {
    db[ctx.params.id] = ctx.request.body
    ctx.body = ctx.request.body
})

usersRouter.delete('/:id', (ctx) => {
    db.splice(ctx.params.id, 1)
    ctx.status = 204
})

// body请求处理中间件
app.use(bodyparser())

// 路由配置
app.use(router.routes())
app.use(usersRouter.routes())

// 响应options方法
app.use(usersRouter.allowedMethods())

app.listen(3000);