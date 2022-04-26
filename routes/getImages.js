const { insertBefore } = require('cheerio/lib/api/manipulation')
const { info } = require('console')
const express = require('express')
const fs = require('fs')
const ini = require('ini')
const { join } = require('path')
const router = express()
/* 读取ini文件 */
const iniData = fs.readFileSync(join(__dirname, '../config/config.ini')).toString()
/* 读取ini文件， 并保存到str常量 */
const str = ini.parse(iniData)
/* 读取img标签 */
const img = str['img']
/* 定义图片存储路径常量 */
const image_path = img.IMAGE_DIR_PATH

/* 列出以下载的画师的作品 */
router.get('/list', async (req, res, next) => {
    if (!fs.existsSync(join(__dirname, `../${image_path}`))) {
        fs.mkdirSync(join(__dirname, `../${image_path}`))
    }
    /* 从req.query中获取uid(画师id)与type */
    const { uid, type } = req.query
    /* 判断传入值是否为空 */
    if (type !== undefined && type !== null && type !== false && type !== ''
    ) {
        if (type === 'once') {
            if (uid !== undefined && uid !== null && uid !== false && uid !== '') {
                /* 非空则判断文件夹是否存在 */
                if (!fs.existsSync(join(__dirname, `../${image_path}/uid-${uid}`))) {
                    /* 不存在则提示用户下载 */
                    return res.json({
                        success: false,
                        message: '未下载该画师的图片, 请访问 down 接口进行下载',
                        params: {},
                        suggestion: ''
                    })
                } else {
                    /* 存在则使用fs模块取得该目录下文件以及文件夹的数组 */
                    let image_list = fs.readdirSync(join(__dirname, `../${image_path}/uid-${uid}`))
                    /* 初始化infoJson对象 */
                    let infoJson = {
                        success: true,
                        count: image_list.length,
                        uid: uid,
                        pid: []
                    }

                    /* 遍历image_list每一项， 并添加到src遍历中 */
                    image_list.forEach((element, index) => {
                        let _pid = element.replace(/(^pid-)|(.jpg)/g, '')
                        let image_path_true = join(__dirname, `../${image_path}`, `uid-${uid}`, element)
                        infoJson.pid.push({
                            filepath: image_path_true,
                            filename: element,
                            pid: _pid
                        })
                    })
                    /* 向用户返回获得的列表 */
                    return res.json(infoJson)
                    /* 执行next函数 */
                    next()
                }
            } else {
                return res.json({
                    success: false,
                    message: '请输入要查询的画师 id',
                    params: {},
                    suggestion: ''
                })

            }
        } else if (type === 'all') {
            let user_list = fs.readdirSync(join(__dirname, `../${image_path}`))
            let infoJson = {
                success: true,
                count: user_list.length,
                painter: []
            }
            user_list.forEach(async (element, index) => {
                let image_list = fs.readdirSync(join(__dirname, `../${image_path}/${element}`))
                let painterPath = join(__dirname, `../${image_path}/${element}`)
                let _uid = element.replace(/uid-/g, '')
                infoJson.painter.push({
                    uid: _uid,
                    path: painterPath,
                    pid: []
                })
                image_list.forEach(async (value, i) => {
                    let image_path_true = join(__dirname, `../${image_path}`, `uid-${element}`, value)
                    let _pid = value.replace(/(^pid-)|(.jpg)/g, '')
                    infoJson.painter[index].pid.push({
                        filepath: image_path_true,
                        filename: value,
                        pid: _pid
                    })
                })
            })
            return res.json(infoJson)
        } else {
            return res.json({
                success: false,
                message: '请输入正确的type',
                params: {
                    type: {
                        about: '检索方式',
                        all: '表示检索所有已下载的画师作品',
                        once: '表示仅检索一个画师的作品'
                    }
                },
                suggestion: ''
            })
        }
    } else {
        /* 若用户未输入值， 则提示用户输入 */
        return res.json({
            success: false,
            message: '请输入正确的type',
            params: {
                type: {
                    about: '检索方式',
                    all: '表示检索所有已下载的画师作品',
                    once: '表示仅检索一个画师的作品'
                }
            },
            suggestion: ''
        })
    }
})

/* 向用户展示图片的接口 */
router.get('/show', (req, res, next) => {
    if (!fs.existsSync(join(__dirname, `../${image_path}`))) {
        fs.mkdirSync(join(__dirname, `../${image_path}`))
    }
    /* 从req.query中导入用户输入的uid和pid */
    const { uid, pid } = req.query
    /* 判断用户输入pid和uid是否未空 */
    if (pid !== undefined && pid !== null && pid !== false && pid !== ''
        && uid !== undefined && uid !== null && uid !== false && uid !== ''
    ) {
        /* 用户非空则进行判断 */
        /* 如果用户输入的uid和pid对应的文件不存在， 则返回错误提示(不抛出异常， 以免程序退出) */
        if (!fs.existsSync(join(__dirname, `../${image_path}/uid-${uid}/pid-${pid}.jpg`))) {
            return res.json({
                success: false,
                message: '文件不存在',
                params: {
                    uid: '即画师id, 例如 3036679',
                    pid: '作品id,  例如 76559075'
                },
                suggestion: '可通过 get/list 接口获得'
            })
        } else {
            /* 如果存在， 则重定向到对应url */
            /* img路由为用户config.ini 中的IMAGE_DIR_PATH指定的文件存储路径 */
            return res.redirect(`/imgs/uid-${uid}/pid-${pid}.jpg`)
            /* 执行next函数 */
            next()
        }
    } else {
        /* 如果用户输入为空， 则提示用户输入 */
        return res.json({
            success: false,
            message: '请输入要查询的画师id和想要展示的图片id',
            params: {
                uid: '即画师id, 例如 3036679',
                pid: '作品id,  例如 76559075'
            },
            suggestion: '可通过 get/list 接口获得'
        })
    }
})

/* 导出路由模块 */
module.exports = router