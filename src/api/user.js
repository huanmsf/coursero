import request from './request'

// 用户登录
export const login = (data) => {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/api/user/info',
    method: 'put',
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