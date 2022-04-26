const express = require('express')
const router = express.Router()
const { SaveImages } = require('../bin/downImage')
const fs = require('fs')
const { join } = require('path')
// 导入ini配置读取模块
const ini = require('ini')
// 读取ini文件， 并保存到str常量
const str = fs.readFileSync(join(__dirname, '../config/config.ini')).toString()
// 读取img标签下的配置
const img = ini.parse(str).img

/* 创建下载接口(GET) */
router.get('/', async (req, res, next) => {
    /* 如果传入的uid不为空， 则开始 */
    if (req.query.uid !== null && req.query.uid !== undefined && req.query.uid !== '') {
        /* 从req.query中导入uid常量 */
        const { uid } = req.query
        /* 执行SaveImages模块下载图片， 并使用一个常量 result 接收返回值 */
        const result = await SaveImages(uid)
        /* 如果返回值为 true 则继续执行 */
        if (result === true) {
            /* 下载成功后返回下载成功的提示给用户 */
            let img_path = join(__dirname, `../${img.IMAGE_DIR_PATH}/uid-${uid}`)
            return res.json({
                success: true,
                message: `下载完成, 文件保存至 ${img_path}`,
            })
            next()
        } else {
            /* 返回失败 */
            if (result !== 'connected false.') {
                /* 不返回 connected false. 则意味着画师未上传图片， 则返回提示给用户 */
                return res.json({
                    success: false,
                    message: `下载失败, 画师: ${uid} 未上传图片`
                })
            } else {
                /* 返回 connected false. 则返回连接api失败的提示给用户 */
                return res.json({
                    success: false,
                    message: '下载失败, 连接API失败'
                })
            }
        }
    } else {
        /* 若用户为输入uid， 则提示用户输入 */
        return res.json({
            success: false,
            message: '请输入画师id'
        })
    }
})

/* 公开模块 */
module.exports = router