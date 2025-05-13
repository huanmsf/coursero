// 默认头像
const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    nickname: '管理员',
    avatar: DEFAULT_AVATAR,
    role: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 'active'
  },
  {
    id: 2,
    username: 'teacher',
    password: '123456',
    nickname: '张老师',
    avatar: DEFAULT_AVATAR,
    role: 'teacher',
    email: 'teacher@example.com',
    phone: '13800138001',
    status: 'active'
  },
  {
    id: 3,
    username: 'student',
    password: '123456',
    nickname: '李同学',
    avatar: DEFAULT_AVATAR,
    role: 'student',
    email: 'student@example.com',
    phone: '13800138002',
    status: 'active'
  }
]

// 模拟订单数据
const orders = [
  {
    id: 1,
    orderNo: 'ORDER202401010001',
    courseId: 1,
    courseName: 'Vue.js 高级教程',
    price: 199,
    status: 'paid',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    orderNo: 'ORDER202401010002',
    courseId: 2,
    courseName: 'React 实战课程',
    price: 299,
    status: 'pending',
    createTime: '2024-01-01 11:00:00'
  }
]

// 模拟收藏数据
const favorites = [
  {
    id: 1,
    courseId: 1,
    title: 'Vue.js 高级教程',
    description: '深入学习 Vue.js 的高级特性和最佳实践',
    cover: 'https://example.com/course1.jpg',
    teacher: '张老师',
    students: 1000,
    price: 199
  },
  {
    id: 2,
    courseId: 2,
    title: 'React 实战课程',
    description: '从零开始学习 React 开发',
    cover: 'https://example.com/course2.jpg',
    teacher: '李老师',
    students: 800,
    price: 299
  }
]

// 模拟学习记录
const learningHistory = [
  {
    id: 1,
    courseId: 1,
    courseName: 'Vue.js 高级教程',
    lessonName: '组件通信',
    progress: 60,
    lastLearnTime: '2024-01-01 15:00:00'
  },
  {
    id: 2,
    courseId: 2,
    courseName: 'React 实战课程',
    lessonName: 'Hooks 使用',
    progress: 30,
    lastLearnTime: '2024-01-01 16:00:00'
  }
]

// 登录
export const login = (data) => {
  const user = users.find(u => u.username === data.username && u.password === data.password)
  if (user) {
    return {
      code: 200,
      data: {
        token: 'mock-token-' + user.id,
        userInfo: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          bio: user.bio,
          isVip: user.isVip
        }
      },
      message: '登录成功'
    }
  }
  return {
    code: 400,
    message: '用户名或密码错误'
  }
}

// 注册
export const register = (data) => {
  const existUser = users.find(u => u.username === data.username)
  if (existUser) {
    return {
      code: 400,
      message: '用户名已存在'
    }
  }
  const newUser = {
    id: users.length + 1,
    ...data,
    role: 'user',
    isVip: false
  }
  users.push(newUser)
  return {
    code: 200,
    message: '注册成功'
  }
}

// 退出登录
export const logout = () => {
  return {
    code: 200,
    message: '退出成功'
  }
}

// 获取用户信息
export const getUserInfo = (token) => {
  const userId = parseInt(token.split('-')[2])
  const user = users.find(u => u.id === userId)
  if (user) {
    return {
      code: 200,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        isVip: user.isVip
      }
    }
  }
  return {
    code: 401,
    message: '用户未登录'
  }
}

// 更新用户信息
export const updateUserInfo = (data) => {
  const user = users.find(u => u.id === data.id)
  if (user) {
    Object.assign(user, data)
    return {
      code: 200,
      message: '更新成功'
    }
  }
  return {
    code: 400,
    message: '用户不存在'
  }
}

// 修改密码
export const changePassword = (data) => {
  const user = users.find(u => u.id === data.id)
  if (user && user.password === data.oldPassword) {
    user.password = data.newPassword
    return {
      code: 200,
      message: '密码修改成功'
    }
  }
  return {
    code: 400,
    message: '原密码错误'
  }
}

// 获取用户订单
export const getUserOrders = (userId) => {
  return {
    code: 200,
    data: orders.filter(order => order.userId === userId)
  }
}

// 获取用户收藏
export const getUserFavorites = (userId) => {
  return {
    code: 200,
    data: favorites
  }
}

// 获取学习记录
export const getUserLearningHistory = (userId) => {
  return {
    code: 200,
    data: learningHistory
  }
}

// 创建用户
export const createUser = (data) => {
  const newUser = {
    id: users.length + 1,
    ...data,
    avatar: data.avatar || DEFAULT_AVATAR,
    status: 'active'
  }
  users.push(newUser)
  return {
    code: 200,
    data: newUser
  }
} 