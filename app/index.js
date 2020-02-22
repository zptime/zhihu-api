const Koa = require('koa');
const bodyparser = require('koa-bodyparser')

const app = new Koa();
const routing = require('./routes')

// body请求处理中间件
app.use(bodyparser())

//路由配置
routing(app)

app.listen(3000, () => {
    console.log('程序成功启动了，在3000端口！！！')
});