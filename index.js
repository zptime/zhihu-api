const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next)=>{
    console.log(1);
    await next();
    console.log(2);

    if(ctx.url === '/'){
        ctx.body = '这是主页'
    } else if(ctx.url === '/users') {
        if(ctx.method === 'POST'){
            ctx.body = '这是用户列表页'
        } else if(ctx.method === 'GET') {
            ctx.body = '这是创建用户'
        } else {
            ctx.status = 405
        }
    } else if(ctx.url.match(/\/users\/\w+/)) {
        const userId = ctx.url.match(/\/users\/(\w+)/)[1]
        ctx.body = `这是用户 ${userId}`
    } else {
        ctx.status = 404
    }
    // ctx.body = 'Hello World, zhihu !';
});

app.use(async (ctx, next)=>{
    console.log(3);
    await next();
    console.log(4);
});

app.use(async (ctx, next)=>{
    console.log(5);
});

// 输出结果：1 3 5 4 2

app.listen(3000);