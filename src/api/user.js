import request from '../utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 获取用户订单列表
export function getUserOrders(params) {
  return request({
    url: '/user/orders',
    method: 'get',
    params
  })
}

// 获取用户收藏列表
export function getUserFavorites(params) {
  return request({
    url: '/user/favorites',
    method: 'get',
    params
  })
}

// 添加收藏
export function addFavorite(courseId) {
  return request({
    url: '/user/favorites',
    method: 'post',
    data: { courseId }
  })
}

// 取消收藏
export function removeFavorite(courseId) {
  return request({
    url: `/user/favorites/${courseId}`,
    method: 'delete'
  })
}

// 获取学习记录
export function getUserLearningHistory(params) {
  return request({
    url: '/user/learning-history',
    method: 'get',
    params
  })
}

// 更新学习进度
export function updateLearningProgress(data) {
  return request({
    url: '/user/learning-progress',
    method: 'put',
    data
  })
}

// 获取用户统计数据
export function getUserStats() {
  return request({
    url: '/user/stats',
    method: 'get'
  })
}

// 上传头像
export function uploadAvatar(data) {
  return request({
    url: '/user/avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 获取用户已购课程
export const getUserCourses = () => {
  return request({
    url: '/api/user/courses',
    method: 'get'
  })
} 