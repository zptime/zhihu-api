const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next)=>{
    console.log(1);
    await next();
    console.log(2);
    ctx.body = 'Hello World, zhihu !';
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