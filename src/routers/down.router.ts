import { Router, Request, Response } from 'express'
import { DownloadImagesController } from '../controllers/downImages.controller'

/** TODO: Instantiate express.Router object.  */
const router: Router = Router()

/** TODO: Setting router.(/down) */
export default router.get('/', async (req: Request, res: Response) => {
  if (req.query.uid) {
    let uid: number = Number(req.query.uid)
    /** TODO: DownloadImagesController initialization. */
    const result: DownImageInit = await new DownloadImagesController(uid).init()
    if ((await result).status == 400) {
      res.status(400)
      return res.json(result)
    }
    res.status(200)
    return res.json(result)
  }
  return res.json({
    status: 400,
    message: "Please insert painter's id.",
    params: [
      {
        param: 'uid',
        description: 'Painter\'s uid',
        example: '/down?uid=xxxxxx'
      }
    ]
  })
})