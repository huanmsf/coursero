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

// 获取课程列表
export const getCourseList = (params) => {
  const { page = 1, pageSize = 10 } = params
  const start = (page - 1) * pageSize
  const end = start + Number(pageSize)
  const list = courses.slice(start, end)
  return {
    code: 200,
    data: {
      list,
      total: courses.length,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  }
}

// 获取课程详情
export const getCourseDetail = (id) => {
  const course = courses.find(c => c.id === parseInt(id))
  if (course) {
    return {
      code: 200,
      data: course
    }
  }
  return {
    code: 404,
    message: '课程不存在'
  }
} 