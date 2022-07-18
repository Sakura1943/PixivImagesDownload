import express, { Express } from 'express'
import cors from 'cors'
import { join } from 'path'

/** TODO: Import controller */
import { ConfigController } from './controllers/config.controller'

/** TODO: Import routers */
import downloadRouter from './routers/down.router'
import getRouter from './routers/get.router'
import indexRouter from './routers/index.router'

/** TODO: Instantiate Express object. */
const app: Express = express()

/** Basic configuration. */
const configuration: Config = new ConfigController().configuration

/** PORT */
const PORT: number = configuration.port ?? 3000

/** TODO: Apply middleware. */
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

/** TODO: Apply routers. */
app.use('/', indexRouter)
app.use('/down', downloadRouter)
app.use('/get', getRouter)
app.use('/images', express.static(join(__dirname, `../${configuration.image_folder}`)))

/** TODO: Port monitor. */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})