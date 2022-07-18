import { Router, Request, Response } from 'express'
import { existsSync, readdirSync, mkdirSync } from 'fs'
import { join } from 'path'

/** TODO: Import Controller. */
import { ConfigController } from '../controllers/config.controller'

/** TODO: Instantiate express.Router object. */
const router: Router = Router()

/** Configuration. */
const configuration: Config = new ConfigController().configuration

/** TODO: setting router("/get/list"). */
router.get('/list', async (req: Request, res: Response) => {
  const uid: number = Number(req.query.uid)
  const type: string = String(req.query.type)
  if (type) {
    /** TODO: type = "one" */
    if (type === "one") {
      if (uid) {
        if (!existsSync(join(__dirname, `../${configuration.image_folder}/uid-${uid}`))) {
          res.status(403)
          return res.json({
            status: res.statusCode,
            message: 'The painter\'s picture is not downloaded, please visit the download(/down) interface to download it.',
            params: {},
            suggestion: ''
          })
        }
        /** TODO: Get Images list. */
        const image_list: string[] = readdirSync(join(__dirname, `../${configuration.image_folder}/uid-${uid}`))
        res.status(200)
        /** TODO: Insert Informations about images list.*/
        let informations: ImagesListInfo = {
          status: res.statusCode,
          count: image_list.length,
          uid: uid,
          pid: []
        }
        /** TODO: Images list loop. */
        image_list.forEach((item: string) => {
          const _pid: string = item.replace(/(^pid-)|(.jpg)/g, '')
          const _image_path: string = join(__dirname, `../${configuration.image_folder}/uid-${uid}/pid-${_pid}.jpg`)
          /** TODO: Insert pid information(pid: Pictrue id.) */
          informations.pid?.push({
            file_path: _image_path,
            file_name: item,
            url: `${req.protocol}://${req.headers.host}/images/uid-${uid}/pid-${_pid}.jpg`,
            pid: _pid
          })
        })
        return res.json(informations)
      }
      res.status(403)
      return res.json({
        status: res.statusCode,
        message: 'Please enter the painter ID you want to query.',
        params: {},
        suggestion: ''
      })
    } else if (type === "all") {
      /** TODO: type = "all" */
      let user_list: string[] = readdirSync(join(__dirname, `../${configuration.image_folder}`))
      res.status(200)
      let informations: ImagesListInfo = {
        status: res.statusCode,
        count: user_list.length,
        painter: []
      }
      /** TODO: Painters list loop. */
      user_list.forEach(async (item: string, index: number) => {
        const painter_path: string = join(__dirname, `../${configuration.image_folder}/${item}`)
        const image_list: string[] = readdirSync(painter_path)
        const _uid: string = item.replace(/uid-/g, '')
        /** TODO: Push painter's informations. */
        informations.painter?.push({
          uid: _uid,
          path: painter_path,
          count: image_list.length,
          pid: []
        })
        /** TODO: Image_list loop. */
        image_list.forEach(async (value: string) => {
          let _image_path: string = join(__dirname, `../${configuration.image_folder}/uid-${item}/${value}`)
          let _pid: string = value.replace(/(^pid-)|(.jpg)/g, '');
          /** TODO: Insert painter's informations. */    
          (informations.painter as PainterInfo[])[index].pid.push({
            file_path: _image_path,
            file_name: value,
            url: `${req.protocol}://${req.headers.host}/images/uid-${_uid}/pid-${_pid}`,
            pid: _pid
          })
        })
      })
      return res.json(informations)
    }
    res.status(400)
    return res.json({
      status: res.statusCode,
      message: 'Please enter the correct type.',
      params: [
        {
          param: 'type',
          description: 'Search type.',
          params: [
            {
              param: 'all',
              description: 'Represents the search for all downloaded painter\' works.',
              example: '/get/list?type=all'
            },
            {
              param: 'one',
              description: 'Indicates that only one painter\'s work is retrieved.',
              example: '/get/list?type=one&uid=xxxxxx'
            }
          ]
        }
      ]
    })
  }
  res.status(400)
  return res.json({
    status: res.statusCode,
    message: 'Please enter the correct type.',
    params: [
      {
        param: 'type',
        description: 'Search type.',
        params: [
          {
            param: 'all',
            description: 'Represents the search for all downloaded painter\' works.',
            example: '/get/list?type=all'
          },
          {
            param: 'one',
            description: 'Indicates that only one painter\'s work is retrieved.',
            example: '/get/list?type=one&uid=xxxxxx'
          }
        ]
      }
    ]
  })
})
/** TODO: Setting router.("/get/show") */
router.get('show', (req: Request, res: Response) => {
  if (!existsSync(join(__dirname, `../${configuration.image_folder}`))) {
    mkdirSync(join(__dirname, `../${configuration.image_folder}`))
  }
  const uid: number = Number(req.query.uid)
  const pid: string = String(req.query.pid)
  if (pid && uid) {
    if (!existsSync(join(__dirname, `../${configuration.image_folder}/uid-${uid}/pid-${pid}.jpg`))) {
      res.status(403)
      return res.json({
        status: res.statusCode,
        message: 'Image is not exists.',
        params: [
          {
            param: 'uid',
            description: 'Painter\'s id.'
          },
          {
            param: 'pid',
            description: 'Painter\'s pid.'
          }
        ],
        example: '/get/show?uid=xxxxxx&pid=xxxxxx',
        data_from: '/get/list'
      })
    }
    res.status(200)
    return res.redirect(`images/uid-${uid}/pid-${pid}.jpg`)
  }
  res.status(403)
  return res.json({
    status: res.statusCode,
    message: 'Image is not exists.',
    params: [
      {
        param: 'uid',
        description: 'Painter\'s id.'
      },
      {
        param: 'pid',
        description: 'Painter\'s pid.'
      }
    ],
    example: '/get/show?uid=xxxxxx&pid=xxxxxx',
    data_from: '/get/list'
  })
})

export default router