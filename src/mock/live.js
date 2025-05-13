// 模拟直播数据
const lives = [
  {
    id: 1,
    title: 'Vue.js 高级特性实战',
    description: '深入讲解 Vue.js 的高级特性和最佳实践',
    cover: 'https://picsum.photos/800/450?random=1',
    teacher: '张老师',
    students: 1000,
    price: 199,
    status: 'live',
    startTime: '2024-03-15 14:00:00',
    endTime: '2024-03-15 16:00:00',
    categoryId: 1,
    category: '前端开发',
    streamUrl: 'https://example.com/live/stream1.m3u8',
    pushUrl: 'rtmp://example.com/live/stream1'
  },
  {
    id: 2,
    title: 'React Hooks 完全指南',
    description: '从入门到精通的 React Hooks 教程',
    cover: 'https://picsum.photos/800/450?random=2',
    teacher: '李老师',
    students: 800,
    price: 299,
    status: 'upcoming',
    startTime: '2024-03-16 15:00:00',
    endTime: '2024-03-16 17:00:00',
    categoryId: 1,
    category: '前端开发',
    streamUrl: '',
    pushUrl: 'rtmp://example.com/live/stream2'
  },
  {
    id: 3,
    title: 'Node.js 性能优化实战',
    description: 'Node.js 应用性能优化技巧与实践',
    cover: 'https://picsum.photos/800/450?random=3',
    teacher: '王老师',
    students: 600,
    price: 399,
    status: 'ended',
    startTime: '2024-03-14 10:00:00',
    endTime: '2024-03-14 12:00:00',
    categoryId: 2,
    category: '后端开发',
    streamUrl: 'https://example.com/live/replay3.m3u8',
    pushUrl: ''
  }
]

// 获取直播列表
export const getLiveList = (params) => {
  const { page = 1, pageSize = 10, status, category } = params
  let filteredLives = [...lives]

  if (status) {
    filteredLives = filteredLives.filter(live => live.status === status)
  }

  if (category) {
    filteredLives = filteredLives.filter(live => live.categoryId === category)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredLives.slice(start, end)

  return {
    code: 200,
    data: {
      list,
      total: filteredLives.length,
      page,
      pageSize
    }
  }
}

// 获取直播详情
export const getLiveDetail = (id) => {
  const live = lives.find(l => l.id === parseInt(id))
  if (live) {
    return {
      code: 200,
      data: live
    }
  }
  return {
    code: 404,
    message: '直播不存在'
  }
}

// 获取直播推流地址
export const getLivePushUrl = (id) => {
  const live = lives.find(l => l.id === parseInt(id))
  if (live && live.pushUrl) {
    return {
      code: 200,
      data: {
        url: live.pushUrl
      }
    }
  }
  return {
    code: 404,
    message: '推流地址不存在'
  }
}

// 获取直播拉流地址
export const getLivePullUrl = (id) => {
  return {
    code: 200,
    data: {
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    }
  }
}

// 获取直播回放地址
export const getLiveReplayUrl = (id) => {
  return {
    code: 200,
    data: {
      url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    }
  }
}

// 获取直播统计数据
export const getLiveStats = (id) => {
  return {
    code: 200,
    data: {
      viewers: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 200)
    }
  }
}

// 获取直播消息
export const getLiveMessages = (id) => {
  const messages = [
    {
      id: 1,
      username: '用户1',
      content: '老师讲得真好！',
      timestamp: Date.now() - 1000 * 60 * 5
    },
    {
      id: 2,
      username: '用户2',
      content: '这个知识点讲得很清楚',
      timestamp: Date.now() - 1000 * 60 * 3
    },
    {
      id: 3,
      username: '用户3',
      content: '请问老师能详细解释一下吗？',
      timestamp: Date.now() - 1000 * 60 * 1
    }
  ]

  return {
    code: 200,
    data: messages
  }
}

// 开始直播
export const startLive = (id) => {
  const live = lives.find(l => l.id === parseInt(id))
  if (live) {
    live.status = 'live'
    return {
      code: 200,
      message: '直播已开始'
    }
  }
  return {
    code: 404,
    message: '直播不存在'
  }
}

// 结束直播
export const endLive = (id) => {
  const live = lives.find(l => l.id === parseInt(id))
  if (live) {
    live.status = 'ended'
    return {
      code: 200,
      message: '直播已结束'
    }
  }
  return {
    code: 404,
    message: '直播不存在'
  }
}

// 创建直播
export const createLive = (data) => {
  // 找到第一个状态为 live 的直播
  const existingLive = lives.find(live => live.status === 'live')
  
  if (existingLive) {
    // 如果找到直播中的直播，直接返回
    return {
      code: 200,
      data: {
        ...existingLive,
        title: data.title,
        category: data.category === 'frontend' ? '前端开发' : 
                 data.category === 'backend' ? '后端开发' :
                 data.category === 'mobile' ? '移动开发' : '人工智能'
      }
    }
  } else {
    // 如果没有直播中的直播，创建一个新的
    const newLive = {
      id: lives.length + 1,
      title: data.title,
      description: data.description || '',
      cover: `https://picsum.photos/800/450?random=${lives.length + 1}`,
      teacher: '当前用户',
      students: 0,
      price: 0,
      status: 'live',
      startTime: new Date().toISOString(),
      endTime: '',
      categoryId: data.category,
      category: data.category === 'frontend' ? '前端开发' : 
                data.category === 'backend' ? '后端开发' :
                data.category === 'mobile' ? '移动开发' : '人工智能',
      streamUrl: 'https://example.com/live/stream1.m3u8',
      pushUrl: `rtmp://example.com/live/stream${lives.length + 1}`
    }
    
    lives.push(newLive)
    
    return {
      code: 200,
      data: newLive
    }
  }
}

// 获取直播流地址
export const getLiveStream = (liveId) => {
  const live = lives.find(l => l.id === Number(liveId))
  if (!live) {
    return {
      code: 404,
      message: '直播不存在'
    }
  }

  // 返回测试直播流地址
  return {
    code: 200,
    data: {
      stream: {
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
      }
    }
  }
}

// 开始直播流
export const startLiveStream = (id, data) => {
  const live = lives.find(l => l.id === parseInt(id))
  if (live) {
    live.status = 'live'
    live.streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    return {
      code: 200,
      data: {
        stream: {
          id: live.id,
          title: live.title,
          status: live.status,
          streamUrl: live.streamUrl
        }
      }
    }
  }
  return {
    code: 404,
    message: '直播不存在'
  }
}

// 停止直播流
export const stopLiveStream = () => {
  return {
    code: 200,
    message: '直播流已停止'
  }
} 