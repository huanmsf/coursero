// 课程数据
const courses = [
  {
    id: 1,
    title: 'Vue.js 3.0 实战教程',
    description: '从零开始学习Vue.js 3.0，掌握现代前端开发技术',
    cover: 'https://picsum.photos/800/450',
    teacher: {
      id: 1,
      name: '张老师',
      avatar: 'https://picsum.photos/100/100'
    },
    category: 'frontend',
    level: 'intermediate',
    price: 199,
    studentCount: 1234,
    rating: 4.8,
    status: 'published', // published, draft
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'React 高级开发',
    description: 'React 高级特性与最佳实践',
    cover: 'https://picsum.photos/800/450?random=2',
    teacher: {
      id: 2,
      name: '李老师',
      avatar: 'https://picsum.photos/100/100?random=2'
    },
    category: 'frontend',
    level: 'advanced',
    price: 299,
    studentCount: 856,
    rating: 4.7,
    status: 'upcoming',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10'
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    description: 'Node.js 企业级应用开发',
    cover: 'https://picsum.photos/800/450?random=3',
    teacher: {
      id: 3,
      name: '王老师',
      avatar: 'https://picsum.photos/100/100?random=3'
    },
    category: 'backend',
    level: 'intermediate',
    price: 399,
    studentCount: 567,
    rating: 4.6,
    status: 'published',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  }
]

// 章节数据
const chapters = [
  {
    id: 1,
    courseId: 1,
    title: 'Vue.js 3.0 基础入门',
    order: 1,
    lessons: [
      {
        id: 1,
        title: 'Vue.js 3.0 介绍',
        type: 'video',
        duration: 1800,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'published'
      },
      {
        id: 2,
        title: 'Vue.js 3.0 直播课',
        type: 'live',
        startTime: '2024-01-20 20:00:00',
        status: 'upcoming',
        recordUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    title: 'React 核心概念',
    order: 1,
    lessons: [
      {
        id: 3,
        title: 'React Hooks 详解',
        type: 'video',
        duration: 2400,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'published'
      },
      {
        id: 4,
        title: 'React 状态管理',
        type: 'video',
        duration: 3600,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'published'
      }
    ]
  },
  {
    id: 3,
    courseId: 3,
    title: 'Node.js 基础',
    order: 1,
    lessons: [
      {
        id: 5,
        title: 'Node.js 环境搭建',
        type: 'video',
        duration: 1200,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'published'
      },
      {
        id: 6,
        title: 'Express 框架入门',
        type: 'video',
        duration: 1800,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'published'
      }
    ]
  }
]

// 讲师申请
const teacherApplications = [
  {
    id: 1,
    userId: 2,
    name: '李老师',
    title: '资深前端工程师',
    description: '5年前端开发经验，精通Vue.js、React等框架',
    status: 'pending', // pending, approved, rejected
    createdAt: '2024-01-10'
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

// 获取课程章节列表
export const getCourseChapters = (courseId) => {
  const courseChapters = chapters.filter(c => c.courseId === parseInt(courseId))
  if (courseChapters.length > 0) {
    return {
      code: 200,
      data: courseChapters
    }
  }
  return {
    code: 404,
    message: '课程章节不存在'
  }
}

// 导出数据
export {
  courses,
  chapters,
  teacherApplications
} 