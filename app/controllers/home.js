const path = require('path')

class HomeCtl {
    index(ctx) {
        ctx.body = '<h1>这是主页</h1>'
    }
    upload(ctx) {
        // 获取文件路径
        const file = ctx.request.files.file
        // ctx.body = { path: file.path }

        // 获取图片链接，替代文件路径
        const basename = path.basename(file.path) // 接受一个绝对路径，并返回basename，即此处返回的是upload_xxx.png
        ctx.body = { url: `${ctx.origin}/uploads/${basename}`}
    }
}

module.exports = new HomeCtl()