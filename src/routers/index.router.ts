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
          description: 'Gets a list of downloaded painter\'s pictures.',
          params: [
            {
              param: 'type',
              options: ['one', 'all'],
              one: {
                description: 'Returns a list of downloaded images from a painter.',
                params: [
                  {
                    param: 'uid',
                    description: "painter's id"
                  }
                ],
                example: '/get/list?type=one&uid=xxxxxx'
              },
              all: {
                description: 'Lists a list of pictures of all downloaded painters.',
                example: '/get/list?type=all'
              }
            }
          ]
        },
        show: {
          path: '/get/show',
          description: 'Show a picture of the painter who has been downloaded.',
          params: [
            {
              param: 'uid',
              description: 'The painter id corresponding to the picture can be obtained through the `/get/list` api interface.'
            },
            {
              param: 'pid',
              description: 'The pid of the image is available via the `/get/list` api interface.'
            }
          ],
          example: '/get/show?uid=xxxxxx&pid=xxxxxx'
        }
      },
      down: {
        path: '/down',
        type: 'GET',
        description:'Painter\'s work download (picture).',
        params: [
          {
            param: 'uid',
            description: 'The id of the painter to download the picture.'
          }
        ],
        example: '/down?uid=xxxxxx'
      }
    }
  })
})

export default router