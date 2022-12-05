import request from '@/utils/request'

const api = {
  albums: '/albums',
  album: '/album',
  delete: '/album',
  post: '/album',
  put: '/album'
}

export default api

export function getAlbums (parameter) {
  return request({
    url: api.albums,
    method: 'get',
    params: parameter
  })
}

export function getAlbum (parameter) {
  return request({
    url: api.album,
    method: 'get',
    params: parameter
  })
}

export function delAlbum (parameter) {
  return request({
    url: api.delete,
    method: 'delete',
    params: parameter
  })
}

export function addAlbum (parameter) {
  return request({
    url: api.post,
    method: 'post',
    params: parameter
  })
}

export function upAlbum (parameter) {
  return request({
    url: api.put,
    method: 'put',
    params: parameter
  })
}
