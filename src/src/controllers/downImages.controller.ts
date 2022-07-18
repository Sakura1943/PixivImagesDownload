import axios, { AxiosResponse } from 'axios'
import { existsSync, mkdirSync, createWriteStream } from 'fs'
import { join } from 'path'

/** TODO: Import controller. */
import { ConfigController } from './config.controller'

export default {}

/**
 * A class to download images.
 * @type {DownloadImagesController}
*/
export class DownloadImagesController {
  private configuration: Config = new ConfigController().configuration

  public constructor(private uid: number) {
    this.init()
  }

  /** 
   * A method to initiate.
   * @return {Promise<DownImageInit>}
  */
  public async init(): Promise<DownImageInit> {
    const result: boolean = await this.saveImages()
    if (result) {
      /** TODO: Get image path. */
      let image_path: string = join(__dirname, `../${this.configuration.image_folder}/uid-${this.uid}`)
      return {
        status: 200,
        message: `Downloaded! Images path: ${image_path}`
      }
    }
    return {
      status: 400,
      message: `Download failed!`
    }
  }
  /**
   * A method to get images list.
   * @return {Promise<AxiosResponse<ImagesList, ImagesList> | boolean>}
  */
  private getImagesList(): Promise<AxiosResponse<ImagesList, ImagesList> | boolean> {
    return new Promise(async resolve => {
      try {
        /** TODO: Get api datas. */
        let image: AxiosResponse<ImagesList, ImagesList> = await axios.get(`https://proxy.sakunia.tk/https://api.acgmx.com/public/search/users/illusts?id=${this.uid}&offset=30`)
        if (image.data.illusts.length == 0) {
          resolve(false)
        }
        resolve(image)
      } catch(err) {
        console.error("[ERROR]", err)
        resolve(false)
      }
    })
  }
  /**
   * A method to save the pictrue in local storage.
   * @return {Promise<boolean>}
  */
  private async saveImages(): Promise<boolean> {
    if (!existsSync(join(__dirname, "../", this.configuration.image_folder))) {
      mkdirSync(join(__dirname, "../", this.configuration.image_folder))
    }
    /** TODO: Get images list. */
    let imageList: AxiosResponse<ImagesList, ImagesList> = (await this.getImagesList() as AxiosResponse<ImagesList, any>)
    if (imageList) {
      /** TODO: Imagelist loop. */
      imageList.data.illusts.forEach(async (item: ImageDatas) => {
        let imageUrl: string = item.meta_single_page.original_image_url
        let picId: number = item.id
        /** TODO: Set https proxy. */
        imageUrl = imageUrl.replace(/i.pximg.net/g, 'pixiv.sakunia.tk')
        if (!existsSync(join(__dirname, "../", this.configuration.image_folder, `./uid-${this.uid}`))) {
          mkdirSync(join(__dirname, '../', this.configuration.image_folder, `./uid-${this.uid}`))
        }
        /** TODO: Get image data stream. */
        let imageData: AxiosResponse<any, any> = await axios.get(imageUrl, {
          responseType: 'stream'
        })
        //
        let _writeStream = createWriteStream(join(__dirname, `../${this.configuration.image_folder}/uid-${this.uid}/pid-${picId}.jpeg`))
        /** TODO: Save the picture. */
        imageData.data.pipe(_writeStream)
        return true
      })
    } else {
      console.error(`User ${this.uid} haven't upload images.`)
      return false
    }
    return true
  }
}