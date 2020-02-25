const Koa = require('koa');
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const { connectionStr } = require('./config')

const app = new Koa();
const routing = require('./routes')

// 连接数据库
mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('MongoDB 连接成功了！'))
mongoose.connection.on('error', console.error)

/**
 * 自定义错误处理中间件：放在所有中间件最前面，使用try,catch拦截错误
 * 缺点：不能捕获404信息
 */
// app.use(async (ctx, next) => {
//     try{
//         await next();
//     }catch(err) {
//         ctx.status = err.status || err.statusCode || 500;
//         ctx.body = {
//             message: err.message
//         }
//     }
// })

// kao-json-error错误处理中间件
app.use(error({
    // 定制返回格式：ES6解构语法，控制stack的返回，生产阶段不返回，开发阶段才返回
    postFormat: (e, { stack, ...rest }) =>  process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

// koa本身无法处理body数据
// koa-bodyparser：获取表单请求的数据，把koa2上下文的formData数据解析到ctx.request.body的中间件
app.use(bodyparser())

// 通常用来校验请求体，放在请求体后面
// 传入参数app，该中间件还有一个功能，可以在上下文(ctx)中加上一个方法，即全局方法，帮助校验
app.use(parameter(app))

//路由配置
routing(app)

// nodemon：用来监视node.js应用程序中的任何更改并自动重启服务，适合用在开发环境中。
// nodemon只是简单的包装node应用程序，并监控任何已经改变的文件。
// nodemon只是node的替换包，只是在运行脚本时将其替换命令行上的node。

// 原因：windows不支持NODE_ENV=development的设置方式，使用会阻塞或者报错。而且windows平台与POSIX，或者linux系统在使用命令行(配置和使用环境变量)时有许多区别
// cross-env：运行跨平台设置和使用环境变量的脚本，可以跨平台地设置及使用环境变量
// cross-env：提供一个设置环境变量的scripts，以unix方式设置环境变量，在windows上也能够兼容。

app.listen(3000, () => {
    console.log('程序成功启动了，在3000端口！！！')
});