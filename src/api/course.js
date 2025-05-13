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
export function getCourseChapters(courseId) {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'get'
  })
}

// 创建课程
export function createCourse(data) {
  return request({
    url: '/courses',
    method: 'post',
    data
  })
}

// 更新课程
export function updateCourse(id, data) {
  return request({
    url: `/courses/${id}`,
    method: 'put',
    data
  })
}

// 删除课程
export function deleteCourse(id) {
  return request({
    url: `/courses/${id}`,
    method: 'delete'
  })
}

// 创建章节
export function createChapter(courseId, data) {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'post',
    data
  })
}

// 更新章节
export function updateChapter(courseId, chapterId, data) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}`,
    method: 'put',
    data
  })
}

// 删除章节
export function deleteChapter(courseId, chapterId) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}`,
    method: 'delete'
  })
}

// 上传视频
export function uploadVideo(data) {
  return request({
    url: '/videos/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 申请成为讲师
export function applyTeacher(data) {
  return request({
    url: '/teacher/applications',
    method: 'post',
    data
  })
}

// 获取讲师申请状态
export function getTeacherApplicationStatus() {
  return request({
    url: '/teacher/application/status',
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

// 获取课程详情
export const getLessonDetail = (id) => {
  return request({
    url: `/lessons/${id}`,
    method: 'get'
  })
}

// 获取相关课程
export const getRelatedLessons = (id) => {
  return request({
    url: `/lessons/${id}/related`,
    method: 'get'
  })
} 