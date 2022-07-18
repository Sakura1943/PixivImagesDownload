import { Router, Request, Response } from 'express'

/** TODO: Instantiate express.Router object.  */
const router: Router = Router()

/** TODO: Setting router. */
router.get("/", (req: Request, res: Response) => {
  res.status(400)
  return res.json({
    status: res.statusCode,
    path: req.url,
    query_params: req.query,
    options: {
      apis: ['/get/list', '/get/show', '/down'],
      types: ['GET', 'GET', 'GET']
    },
    apis: {
      get: {
        type: 'GET',
        list: {
          path: '/get/list',
          description: '获取已下载的画师图片列表。',
          params: [
            {
              param: 'type',
              options: ['one', 'all'],
              one: {
                description: '返回某位画师的已下载的图片列表。',
                params: [
                  {
                    param: 'uid',
                    description: "画师id"
                  }
                ],
                example: '/get/list?type=one&uid=xxxxxx'
              },
              all: {
                description: '列出所有已下载的画师的图片列表。',
                example: '/get/list?type=all'
              }
            }
          ]
        },
        show: {
          path: '/get/show',
          description: '展示已下载的画师的图片。',
          params: [
            {
              param: 'uid',
              description: '图片对应的画师id, 可通过/get/list接口获得。'
            },
            {
              param: 'pid',
              description: '图片存在本地的pid, 可通过/get/list接口获得。'
            }
          ],
          example: '/get/show?uid=xxxxxx&pid=xxxxxx'
        }
      },
      down: {
        path: '/down',
        type: 'GET',
        description: '画师作品下载(图片)。',
        params: [
          {
            param: 'uid',
            description: '要下载的画师的id。'
          }
        ],
        example: '/down?uid=xxxxxx'
      }
    }
  })
})

export default router