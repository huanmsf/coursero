import express from 'express'
import cors from 'cors'
import courseMock from './course.mjs'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// 课程相关接口
app.get('/courses', (req, res) => {
  res.json(courseMock.getCourseList(req.query))
})

app.get('/courses/:id', (req, res) => {
  res.json(courseMock.getCourseDetail(req.params.id))
})

app.get('/courses/:id/live-status', (req, res) => {
  res.json(courseMock.getLiveStatus(req.params.id))
})

// 直播相关接口
app.get('/lives', (req, res) => {
  res.json(courseMock.getLiveList(req.query))
})

app.get('/lives/:id', (req, res) => {
  res.json(courseMock.getLiveDetail(req.params.id))
})

app.listen(port, () => {
  console.log(`Mock server is running at http://localhost:${port}`)
}) 