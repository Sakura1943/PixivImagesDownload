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
                    return res.send('<h1 style=\'color: red;\'>未下载该画师的图片<h1><p>请访问 <strong>down</strong> 接口进行下载</p>')
                } else {
                    /* 存在则使用fs模块取得该目录下文件以及文件夹的数组 */
                    let image_list = fs.readdirSync(join(__dirname, `../${image_path}/uid-${uid}`))
                    /* 初始化变量src为string */
                    let src = ''
                    /* 遍历image_list每一项， 并添加到src遍历中 */
                    image_list.forEach((element, index) => {
                        src += `${index + 1}: ${element}\n`
                    })
                    /* 向用户返回获得的列表 */
                    return res.send(`<h1>目录 ${join(__dirname, `../${image_path}/uid-${uid}`)} 存在以下图片:</h1><br><p style='width: 100%;white-space: pre-line;'>${src}<p>`)
                    /* 执行next函数 */
                    next()
                }
            } else {
                return res.send(`<h1 style=\'color: red;\'>请输入要查询的画师id<h1>`)

            }
        } else if (type === 'all') {
            let user_list = fs.readdirSync(join(__dirname, `../${image_path}`))
            var Str = ''
            user_list.forEach(async (element, index) => {
                let image_list = fs.readdirSync(join(__dirname, `../${image_path}/${element}`))
                Str += `------------------------------------------\n${index + 1}: ${element}:\n`
                image_list.forEach(async (value, i) => {
                    Str += `\(${i + 1}\): ${value}\n`
                })
            })
            console.log(Str);
            return res.send(`<h1>存在以下画师id以及作品id:</h1><br><p style='width: 100%;white-space: pre-line;'>${Str}<p>`)
        } else {
            return res.send(`<h1 style=\'color: red;\'>请输入正确的type<h1>
            <p>type: 检索方式, all 表示检索所有已下载的画师作品, once表示仅检索一个画师的作品</p>`)
        }
    } else {
        /* 若用户未输入值， 则提示用户输入 */
        return res.send(`<h1 style=\'color: red;\'>请输入正确的type<h1>
        <p>type: 检索方式, all 表示检索所有已下载的画师作品, once表示仅检索一个画师的作品</p>`)
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
            return res.send(`<h1 style=\'color: red;\'>文件不存在<h1><p>输入的参数如下</p><p>uid: 即画师id, 例如 3036679</p><p>pid: 作品id,  例如 76559075</p><h2>可通过 <strong> /get/list接口获得 </strong></h2>`)
        } else {
            /* 如果存在， 则重定向到对应url */
            /* img路由为用户config.ini 中的IMAGE_DIR_PATH指定的文件存储路径 */
            return res.redirect(`/imgs/uid-${uid}/pid-${pid}.jpg`)
            /* 执行next函数 */
            next()
        }
    } else {
        /* 如果用户输入为空， 则提示用户输入 */
        return res.send(`<h1 style=\'color: red;\'>请输入要查询的画师id和想要展示的图片id<h1>
        <p>输入的参数如下</p>
        <p>uid: 即画师id, 例如 3036679</p>
        <p>pid: 作品id,  例如 76559075</p>
        <h2>可通过 <strong> /get/list接口获得 </strong></h2>`)
    }
})

/* 导出路由模块 */
module.exports = router