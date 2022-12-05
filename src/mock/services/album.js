
import Mock from 'mockjs2'
import { builder, getQueryParameters, getBody } from '../util'

const albums = [
    {
        id: 1,
        user_id: 1,
        name: '我的相册001',
        intro: '这是一个简介。。。。。。。。。',
        background_url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.uuhy.com%2Fuploads%2F2010%2F12%2F201022033120-17131.jpg&app=2002',
        cover_url: 'https://tva2.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4e2mf8j30zk0k0n4e.jpg',
        permission: false,
        image_count: 235,
        view_count: 13,
        like_count: 12
    },
    {
        id: 2,
        user_id: 1,
        name: '我的相册002',
        intro: '这是一个简介。。。。。。。。。',
        background_url: 'https://tva1.sinaimg.cn/large/005Q9Qt9ly1gzrh5ahz9kj31hc0u0qb6.jpg',
        cover_url: 'https://tva4.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4gflvgj314r0u0aip.jpg',
        permission: true,
        image_count: 26,
        view_count: 634,
        like_count: 3316
    },
    {
        id: 3,
        user_id: 1,
        name: '我的相册002',
        intro: '这是一个简介。。。。。。。。。',
        background_url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.uuhy.com%2Fuploads%2F2010%2F12%2F201022033120-17131.jpg&app=2002',
        cover_url: 'https://tva4.sinaimg.cn/bmiddle/005Q9Qt9ly1gzrh4mo8s6j31hc0u0qft.jpg',
        permission: false,
        image_count: 73,
        view_count: 37,
        like_count: 367
    }
]

const _getAlbumId = (options) => parseInt(getQueryParameters(options).id)
const _getAlbum = (id) => albums.filter(x => x.id === id)[0]

const getAlbums = (options) => builder(albums)

const getAlbum = (options) => builder(_getAlbum(_getAlbumId(options)))

const delAlbum = (options) => {
    const album = builder(_getAlbum(_getAlbumId(options)))
    if (album) {
        albums.splice(albums.indexOf(album), 1)
        return builder(null, 'ok')
    }

    return builder(null, '此相册不存在！')
}

const addAlbum = (options) => {
    const album = getBody(options)
    album.id = albums.sort((a, b) => b.id - a.id)[0].id + 1
    albums.push(album)

    return builder(null, 'ok')
}

const upAlbum = (options) => {
    const album = getBody(options)
    const lsAlbum = builder(_getAlbum(album.id))
    if (lsAlbum) {
        albums.splice(albums.indexOf(album), 1)
        albums[albums.indexOf(lsAlbum)] = album

        return builder(null, 'ok')
    }

    return builder(null, '此相册不存在！')
}

Mock.mock(/\/api\/albums/, 'get', getAlbums) // 获取
Mock.mock(/\/api\/album/, 'get', getAlbum) // 获取
Mock.mock(/\/api\/album/, 'delete', delAlbum) // 删除
Mock.mock(/\/api\/album/, 'post', addAlbum) // 创建
Mock.mock(/\/api\/album/, 'put', upAlbum) // 更新
