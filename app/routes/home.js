const Router = require('koa-router')
const router = new Router()
const { index, upload } = require('../controllers/home')

// router.get('/', (ctx) => {
//     ctx.body = '<h1>这是首页</h1>'
// })

router.get('/', index)
router.post('/upload', upload)

module.exports = router

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