const axios = require('axios')
const fs = require('fs')
const { join } = require('path')
// 导入ini配置读取模块
const ini = require('ini')
// 读取ini文件， 并保存到str常量
const str = fs.readFileSync(join(__dirname, '../config/config.ini')).toString()
// 读取img标签下的配置
const img = ini.parse(str).img


/**
 * 获取画师作品列表
 * @author sakunia
 * @function 获取画师作品信息
 * @version 1.0.1
 * @description 用户获取画师的前30个画作的信息， 以`JSON`格式的`Promise`对象返回
 * @param {Number} uid 画师`id`
 * @returns {Promise} `ImageUrlList`返回画师作品列表`json`数据
 * @type JSON -> no pic 即无图片, 反之则是数据
 * @example getImageList(3036679) (测试)
 */
function GetImageList(uid) {
    return new Promise(async resolve => {
        try {
            /* 获取图片信息 */
            let image = await axios.get(`https://api.acgmx.com/public/search/users/illusts?id=${uid}&offset=30`)
            /* 如果图片长度等于0则没图片，反之则由 */
            if (image.data.illusts.length == 0) {
                resolve('no pic')
            } else {
                resolve(image.data.illusts)
            }
        } catch (err) {
            /* 如果网络连接失败, 则返回false */
            console.log(err);
            resolve(false)
        }
    })
}

/**
 * 下载画师画像到本地
 * @author sakunia
 * @function 保存画师图片到本地
 * @version 1.0.1
 * @description 调用`GetImageList`函数获取画师作品列表
 *  后使用`axios`获取图片信息流, 并使用`fs`模块创建文件写入流, 将图片写入本地
 * @param {Number} uid 画师`id`
 * @return `true` or `false`
 * @type Promise
 * @example SaveImages(3036679) 测试
 */
async function SaveImages(uid) {
    // 判断保存图片的文件夹是否存在
    if (!fs.existsSync(join(__dirname, `../${img.IMAGE_DIR_PATH}`))) {
        fs.mkdirSync(join(__dirname, `../${img.IMAGE_DIR_PATH}`))
    }
    /* 先获取画师作品列表 */
    var result = await GetImageList(uid)
    /* 如果返回非 false 则获取成功 */
    if (result != false) {
        /* 获取返回非 no pic 则获取成功 */
        if (result != "no pic") {
            /* 遍历列表每一项 */
            result.forEach(async element => {
                /* 获取单个项的原始URL */
                var imageUrl = element.meta_single_page.original_image_url
                /* 获取作品id */
                var picID = element.id
                /* 替换字符串中的 i.pximg.net 使用我的代理 pixiv.sakunia.tk (CloudFlare的Workder) */
                imageUrl = await imageUrl.replace(/i.pximg.net/g, 'pixiv.sakunia.tk')
                /* 如果存储图片的路径不存在， 则创建 */
                if (!fs.existsSync(join(__dirname, `../${img.IMAGE_DIR_PATH}/uid-${uid}`))) {
                    fs.mkdirSync(join(__dirname, `../${img.IMAGE_DIR_PATH}/uid-${uid}`))
                }
                /* 用 axios 获取图片文件流 */
                var imageData = await axios.get(imageUrl, { responseType: 'stream' })
                /* 使用 fs 创建写入文件流 */
                /* 此时值空 */
                var ws = fs.createWriteStream(join(__dirname, `../${img.IMAGE_DIR_PATH}/uid-${uid}/pid-${picID}.jpg`))
                /* 使用管道， 将图片的文件流传入创建的 fs 写入文件流 */
                imageData.data.pipe(ws)
            });
            /* 返回成功 */
            return true
        } else {
            /* 如果未查询到画师图片，控制的输出错误, 但不抛出错误， 以免程序退出 */
            console.log(`用户: ${uid} 未上传图片`);
            /* 返回失败 */
            return false
        }
    } else {
        /* 返回连接失败 */
        return 'connected false.'
    }
}

/* 公开模块 */
module.exports = {
    GetImageList,
    SaveImages
}