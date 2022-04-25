# pixiv 图片下载服务
> (仅使用画师`id`进行下载)
## 一、简介
该项目由 [RainChain](https://rainchan.win) 提供的接口进行进一步封装<br>提供了将对应画师`id`的前30张图片下载本地的服务<br>源API接口作者接口文档地址 [https://api.hcyacg.com](https://api.hcyacg.com)

## 二、接口信息
| 接口地址                         | 接口参数      | 参数类型 | 参数描述                                                 |
| -------------------------------- | ------------- | -------- | -------------------------------------------------------- |
| `http://localhost:3000/down`     | `uid`         | `GET`    | 传入画师`uid`, 在后台下载， 并返回存储地址               |
| `http://localhost:3000/get/list` | `uid`         | `GET`    | 传入画师`uid`, 并返回存在的图片列表                      |
| `http://localhost:3000/get/show` | `uid` & `pid` | `GET`    | `uid`即画师id, `pid`即画师作品id(通过`get/list`接口获得) |

## 三、使用
### 1、克隆该仓库到本地
```shell
git clone https://github.com/Sakura1943/PixivImagesDownload.git
```
若下载较慢， 可以尝试使用`github`的反向代理进行克隆
```shell
git clone https://proxy.sakunia.tk/https://github.com/Sakura1943/PixivImagesDownload.git
```

### 2、编辑`config.ini`配置文件
项目配置文件在项目目录下的`config/config.ini`
```ini
; 服务地址
[app]
; 服务端口，默认 3000
PORT=3000
; 主机地址， 默认 localhost
HOST=localhost
; 存储位置
[img]
; 默认， 于项目根目录的 images 文件夹
IMAGE_DIR_PATH=images
```

### 3、安装`node`项目依赖
```shell
npm install
```

###  4、运行
```shell
npm run dev
```

### 5、调用接口
下载
```shell
curl http://localhost:3000/down?uid=xxxx
```
下载完就会提示保存的路径了

查看列表
```shell
curl http://localhost:3000/get/list?uid=xxx
```
查看图片
```shell
浏览器输入地址: http://localhost:3000/get/show?uid=xxx&pid=xxx
```

## 四、开源协议
[GNU GPLv3](https://github.com/Sakura1943/PixivImagesDownload/blob/main/LICENSE)