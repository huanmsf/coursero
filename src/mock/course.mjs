// 模拟课程数据
const courses = [
  {
    id: 1,
    title: 'Vue3 实战教程',
    teacher: '张老师',
    students: 1234,
    price: 199,
    status: 'live',
    cover: 'https://picsum.photos/800/450?random=1',
    startTime: new Date().getTime() + 3600000,
    description: 'Vue3 从入门到精通的实战课程'
  },
  {
    id: 2,
    title: 'React 高级开发',
    teacher: '李老师',
    students: 856,
    price: 299,
    status: 'upcoming',
    cover: 'https://picsum.photos/800/450?random=2',
    startTime: new Date().getTime() + 7200000,
    description: 'React 高级特性与最佳实践'
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    teacher: '王老师',
    students: 567,
    price: 399,
    status: 'ended',
    cover: 'https://picsum.photos/800/450?random=3',
    startTime: new Date().getTime() - 3600000,
    description: 'Node.js 企业级应用开发'
  }
]

// 模拟直播数据
const lives = courses.map(course => ({
  ...course,
  streamUrl: `rtmp://localhost/live/${course.id}`,
  replayUrl: `http://localhost/videos/${course.id}.mp4`
}))

export default {
  // 获取课程列表
  getCourseList: (params) => {
    return {
      code: 0,
      data: {
        list: courses,
        total: courses.length
      }
    }
  },

  // 获取课程详情
  getCourseDetail: (id) => {
    const course = courses.find(c => c.id === parseInt(id))
    return {
      code: 0,
      data: course
    }
  },

  // 获取直播列表
  getLiveList: (params) => {
    return {
      code: 0,
      data: {
        list: lives,
        total: lives.length
      }
    }
  },

  // 获取直播详情
  getLiveDetail: (id) => {
    const live = lives.find(l => l.id === parseInt(id))
    return {
      code: 0,
      data: live
    }
  },

  // 获取直播状态
  getLiveStatus: (id) => {
    const live = lives.find(l => l.id === parseInt(id))
    return {
      code: 0,
      data: {
        streamUrl: live.streamUrl,
        status: live.status
      }
    }
  }
} 