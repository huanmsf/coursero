import request from '../utils/request'

// 获取直播列表
export const getLiveList = (params) => {
  return request({
    url: '/lives',
    method: 'get',
    params
  })
}

// 获取直播详情
export const getLiveDetail = (id) => {
  return request({
    url: `/lives/${id}`,
    method: 'get'
  })
}

// 获取直播推流地址
export const getLivePushUrl = (id) => {
  return request({
    url: `/lives/${id}/push-url`,
    method: 'get'
  })
}

// 获取直播拉流地址
export const getLivePullUrl = (id) => {
  return request({
    url: `/lives/${id}/pull-url`,
    method: 'get'
  })
}

// 获取直播回放地址
export const getLiveReplayUrl = (id) => {
  return request({
    url: `/lives/${id}/replay-url`,
    method: 'get'
  })
}

// 获取直播统计数据
export const getLiveStats = (id) => {
  return request({
    url: `/lives/${id}/stats`,
    method: 'get'
  })
}

// 获取直播消息
export const getLiveMessages = (id) => {
  return request({
    url: `/lives/${id}/messages`,
    method: 'get'
  })
}

// 开始直播
export const startLive = (id) => {
  return request({
    url: `/lives/${id}/start`,
    method: 'post'
  })
}

// 结束直播
export const endLive = (id) => {
  return request({
    url: `/lives/${id}/end`,
    method: 'post'
  })
}

// 报名直播
export const registerLive = (id) => {
  return request({
    url: `/lives/${id}/register`,
    method: 'post'
  })
}

// 发送直播消息
export function sendLiveMessage(id, data) {
  return request({
    url: `/lives/${id}/messages`,
    method: 'post',
    data
  })
}

// 更新直播信息
export function updateLive(id, data) {
  return request({
    url: `/lives/${id}`,
    method: 'put',
    data
  })
}

// 删除直播
export function deleteLive(id) {
  return request({
    url: `/lives/${id}`,
    method: 'delete'
  })
} 