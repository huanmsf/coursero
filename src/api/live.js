import request from '../utils/request'

// 获取直播列表
export function getLiveList(params) {
  return request({
    url: '/lives',
    method: 'get',
    params
  })
}

// 获取直播详情
export function getLiveDetail(id) {
  return request({
    url: `/lives/${id}`,
    method: 'get'
  })
}

// 报名直播
export function registerLive(id) {
  return request({
    url: `/lives/${id}/register`,
    method: 'post'
  })
}

// 获取直播推流地址
export function getLivePushUrl(id) {
  return request({
    url: `/lives/${id}/push-url`,
    method: 'get'
  })
}

// 获取直播拉流地址
export function getLivePullUrl(id) {
  return request({
    url: `/lives/${id}/pull-url`,
    method: 'get'
  })
}

// 获取直播回放地址
export function getLiveReplayUrl(id) {
  return request({
    url: `/lives/${id}/replay-url`,
    method: 'get'
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

// 获取直播消息历史
export function getLiveMessages(id, params) {
  return request({
    url: `/lives/${id}/messages`,
    method: 'get',
    params
  })
}

// 获取直播统计数据
export function getLiveStats(id) {
  return request({
    url: `/lives/${id}/stats`,
    method: 'get'
  })
}

// 开始直播
export function startLive(id) {
  return request({
    url: `/lives/${id}/start`,
    method: 'post'
  })
}

// 结束直播
export function endLive(id) {
  return request({
    url: `/lives/${id}/end`,
    method: 'post'
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