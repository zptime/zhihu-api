const Router = require('koa-router')
// const jwtwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')

// 前缀实现
const router = new Router({ prefix: '/users'})
const { 
    find, findById, create, update, delete: del, login, checkOwner,
    listFollowing, listFollowers, checkUserExist, follow, unfollow,
    listFollowingTopics, followTopic, unfollowTopic,
    listQuestions, listFollowingQuestions, followQuestion, unfollowQuestion, 
    listLikingAnswers, likeAnswer, unlikeAnswer, listDislikingAnswers, dislikeAnswer, undislikeAnswer,
    listCollectingAnswers, collectAnswer, uncollectAnswer,
    listLikingComments, likeComment, unlikeComment, listDislikingComments, dislikeComment, undislikeComment,
} = require('../controllers/users')

const { checkTopicExist } = require('../controllers/topics')
const { checkQuestionExist } = require('../controllers/questions')
const { checkAnswerExist } = require('../controllers/answers')
const { checkCommentExist } = require('../controllers/comments')

const { secret } = require('../config')

// 第三方认证koa-jwt
const auth = jwt({ secret })

// 自定义认证实现
// const auth = async (ctx, next) => {
//     const { authorization = '' } = ctx.request.header // =''：设置默认值，防止undefined时，replace函数报错
//     const token = authorization.replace('Bearer ', '')

//     // 将所有错误均抛成401-未认证错误，message可能为未提供token，或者token不合法等等
//     try {
//         // verify函数可能会报各种错误
//         const user = jwtwebtoken.verify(token, secret)
//         // ctx.state：约定俗成放置用户相关的信息
//         ctx.state.user = user
//     } catch(err) {
//         ctx.throw(401, err.message)
//     }
//     await next() // 执行之后的中间件
// }

// 获取用户列表
router.get('/', find)
// 获取单个用户信息
router.get('/:id', findById)
// 新增用户
router.post('/', create)
// 全部替换
// router.put('/:id', update)
// 修改用户信息（局部替换）
router.patch('/:id', auth, checkOwner, update)
// 删除用户：只能删除自己，需要加入授权逻辑。整体逻辑：验证--授权--操作（更新，删除）
router.delete('/:id', auth, checkOwner, del)
// 登录
router.post('/login', login)

// 获取关注人列表；获取粉丝列表；关注；取消关注
router.get('/:id/following', listFollowing)
router.get('/:id/followers', listFollowers)
// 关注：每个请求都携带token，可以知道具体是谁，不需要传当前用户id了。/following/:id（被关注人的id）
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)

// 话题列表；关注话题；取消关注话题
router.get('/:id/followingTopics', listFollowingTopics)
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)

// 用户的问题列表；问题的粉丝列表；关注问题；取消关注问题
router.get('/:id/questions', listQuestions)
router.get('/:id/followingQuestions', listFollowingQuestions)
router.put('/followingQuestions/:id', auth, checkQuestionExist, followQuestion)
router.delete('/followingQuestions/:id', auth, checkQuestionExist, unfollowQuestion)

// 赞（答案）列表；赞；取消赞；踩列表；踩；取消踩
router.get('/:id/likingAnswers', listLikingAnswers)
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer) // 互斥关系，赞的时候取消踩
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer)
router.get('/:id/dislikingAnswers', listDislikingAnswers)
router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer) // 互斥关系，踩的时候取消赞
router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer)

// 收藏（答案）列表；收藏；取消收藏
router.get('/:id/collectingAnswers', listCollectingAnswers)
router.put('/collectingAnswers/:id', auth, checkAnswerExist, collectAnswer)
router.delete('/collectingAnswers/:id', auth, checkAnswerExist, uncollectAnswer)

// 赞（评论）列表；赞；取消赞；踩列表；踩；取消踩
router.get('/:id/likingComments', listLikingComments)
router.put('/likingComments/:id', auth, checkCommentExist, likeComment, undislikeComment)
router.delete('/likingComments/:id', auth, checkCommentExist, unlikeComment)
router.get('/:id/dislikingComments', listDislikingComments)
router.put('/dislikingComments/:id', auth, checkCommentExist, dislikeComment, unlikeComment)
router.delete('/dislikingComments/:id', auth, checkCommentExist, undislikeComment)


module.exports = router