import request from '../utils/request'

// 获取课程列表
export function getCourseList(params) {
  return request({
    url: '/courses',
    method: 'get',
    params
  })
}

// 获取课程详情
export function getCourseDetail(id) {
  return request({
    url: `/courses/${id}`,
    method: 'get'
  })
}

// 获取课程章节列表
export function getCourseLessons(id) {
  return request({
    url: `/courses/${id}/lessons`,
    method: 'get'
  })
}

// 获取课程评论列表
export function getCourseComments(id, params) {
  return request({
    url: `/courses/${id}/comments`,
    method: 'get',
    params
  })
}

// 添加课程评论
export function addCourseComment(id, data) {
  return request({
    url: `/courses/${id}/comments`,
    method: 'post',
    data
  })
}

// 获取直播状态
export function getLiveStatus(id) {
  return request({
    url: `/courses/${id}/live-status`,
    method: 'get'
  })
}

// 购买课程
export function purchaseCourse(id) {
  return request({
    url: `/courses/${id}/purchase`,
    method: 'post'
  })
}

// 获取课程学习进度
export function getCourseProgress(id) {
  return request({
    url: `/courses/${id}/progress`,
    method: 'get'
  })
}

// 更新课程学习进度
export function updateCourseProgress(id, data) {
  return request({
    url: `/courses/${id}/progress`,
    method: 'put',
    data
  })
} 