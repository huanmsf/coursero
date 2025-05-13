import express from 'express'
import cors from 'cors'
import * as userMock from './user.js'
import * as courseMock from './course.js'
import * as liveMock from './live.js'
import { chapters } from './course.js'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// 用户登录
app.post('/api/user/login', (req, res) => {
  const result = userMock.login(req.body)
  res.json(result)
})

// 用户注册
app.post('/api/user/register', (req, res) => {
  const result = userMock.register(req.body)
  res.json(result)
})

// 退出登录
app.post('/api/user/logout', (req, res) => {
  const result = userMock.logout()
  res.json(result)
})

// 获取用户信息
app.get('/api/user/info', (req, res) => {
  const token = req.headers.authorization
  const result = userMock.getUserInfo(token)
  res.json(result)
})

// 更新用户信息
app.put('/api/user/info', (req, res) => {
  const result = userMock.updateUserInfo(req.body)
  res.json(result)
})

// 修改密码
app.put('/api/user/password', (req, res) => {
  const result = userMock.changePassword(req.body)
  res.json(result)
})

// 获取用户订单
app.get('/api/user/orders', (req, res) => {
  const userId = req.query.userId
  const result = userMock.getUserOrders(userId)
  res.json(result)
})

// 获取用户收藏
app.get('/api/user/favorites', (req, res) => {
  const userId = req.query.userId
  const result = userMock.getUserFavorites(userId)
  res.json(result)
})

// 获取学习记录
app.get('/api/user/learning-history', (req, res) => {
  const userId = req.query.userId
  const result = userMock.getUserLearningHistory(userId)
  res.json(result)
})

// 课程相关接口
app.get('/api/courses', (req, res) => {
  const result = courseMock.getCourseList(req.query)
  res.json(result)
})

app.get('/api/courses/:id', (req, res) => {
  const result = courseMock.getCourseDetail(req.params.id)
  res.json(result)
})

app.get('/api/courses/:id/chapters', (req, res) => {
  const result = courseMock.getCourseChapters(req.params.id)
  res.json(result)
})

// 获取课程详情
app.get('/api/lessons/:id', (req, res) => {
  const { id } = req.params
  const lesson = chapters.reduce((found, chapter) => {
    if (found) return found
    return chapter.lessons.find(lesson => lesson.id === parseInt(id))
  }, null)

  if (lesson) {
    res.json({
      code: 200,
      data: {
        ...lesson,
        description: '这是课程描述',
        viewCount: Math.floor(Math.random() * 1000)
      }
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '课程不存在'
    })
  }
})

// 获取相关课程
app.get('/api/lessons/:id/related', (req, res) => {
  const { id } = req.params
  const currentLesson = chapters.reduce((found, chapter) => {
    if (found) return found
    return chapter.lessons.find(lesson => lesson.id === parseInt(id))
  }, null)

  if (currentLesson) {
    const currentChapter = chapters.find(chapter => 
      chapter.lessons.some(lesson => lesson.id === parseInt(id))
    )
    
    const relatedLessons = currentChapter.lessons
      .filter(lesson => lesson.id !== parseInt(id))
      .slice(0, 5)

    res.json({
      code: 200,
      data: relatedLessons
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '课程不存在'
    })
  }
})

// 直播相关接口
app.get('/api/lives', (req, res) => {
  const result = liveMock.getLiveList(req.query)
  res.json(result)
})

app.get('/api/lives/:id', (req, res) => {
  const result = liveMock.getLiveDetail(req.params.id)
  res.json(result)
})

app.get('/api/lives/:id/push-url', (req, res) => {
  const result = liveMock.getLivePushUrl(req.params.id)
  res.json(result)
})

app.get('/api/lives/:id/pull-url', (req, res) => {
  const result = liveMock.getLivePullUrl(req.params.id)
  res.json(result)
})

app.get('/api/lives/:id/replay-url', (req, res) => {
  const result = liveMock.getLiveReplayUrl(req.params.id)
  res.json(result)
})

app.get('/api/lives/:id/stats', (req, res) => {
  const result = liveMock.getLiveStats(req.params.id)
  res.json(result)
})

app.get('/api/lives/:id/messages', (req, res) => {
  const result = liveMock.getLiveMessages(req.params.id)
  res.json(result)
})

// 创建直播
app.post('/api/lives', (req, res) => {
  const result = liveMock.createLive(req.body)
  res.json(result)
})

app.post('/api/lives/:id/start', (req, res) => {
  const result = liveMock.startLive(req.params.id)
  res.json(result)
})

app.post('/api/lives/:id/end', (req, res) => {
  const result = liveMock.endLive(req.params.id)
  res.json(result)
})

// 开始直播流
app.post('/api/lives/:id/stream', (req, res) => {
  const result = liveMock.startLiveStream(req.params.id, req.body)
  res.json(result)
})

// 获取直播流
app.get('/api/lives/:id/stream', (req, res) => {
  const result = liveMock.getLiveStream(req.params.id)
  res.json(result)
})

// 停止直播流
app.post('/api/lives/stream/stop', (req, res) => {
  const result = liveMock.stopLiveStream()
  res.json(result)
})

app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`)
}) 