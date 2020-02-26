// 重要的配置信息：为了安全，这些变量值都应该替换成环境变量，防止信息泄露，外部盗用
module.exports = {
    secret: 'jwt-secret',
    connectionStr: 'mongodb+srv://root:admin123456@pzhang-tveic.mongodb.net/test?retryWrites=true&w=majority'
}