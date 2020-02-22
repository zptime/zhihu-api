/**
 * 批量读取该目录下的文件，实现路由的批量注册
 */
const fs = require('fs');

module.exports = (app) => {
    // readdirSync：同步读取目录
    // __dirname：获取当前目录
    fs.readdirSync(__dirname).forEach(file => {
        // 排除index文件
        if (file === 'index.js') {
            return;
        }

        // 提取文件
        const route = require(`./${file}`)
        // 路由配置
        app.use(route.routes())
        // 响应options方法
        app.use(route.allowedMethods())
    })
}