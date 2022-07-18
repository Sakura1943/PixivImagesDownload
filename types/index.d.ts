/**
 * Configuration Data Type.
 * @type {Config}
 * @property {number} port
 * @property {string} host
*/
declare type Config = {
  port: number;
  host: string;
  image_folder: string;
}

/**
 * Image datas.
 * @type {ImageData}
 * @property {number} id
 * @property {Object} meta_single_page
*/
declare type ImageDatas = {
  id: number;
  meta_single_page: {
    original_image_url: string;
  };
}

/**
 * Images list datas.
 * @type {ImagesList}
 * @property {ImageDatas[]} illusts
*/
declare type ImagesList = {
  illusts: ImageDatas[];
}

/**
 * Init type for class `DownImageController`
 * @type {DownImageInit}
 * @property {number} status
 * @property {string} message
*/
declare type DownImageInit = {
  status: number;
  message: string;
}

/**
 * Picture informations.
 * @type {PictureInfo}
 * @property {string} file_path
 * @property {string} file_name
 * @property {string} url
 * @property {string} pid
*/
declare type PictureInfo = {
  file_path: string;
  file_name: string;
  url: string;
  pid: string;
}

/**
 * Images list informations type.
 * @type {ImagesListInfo}
 * @property {number} status
 * @property {number} count
 * @property {number} uid
 * @property {PictureInfo[]} pid
 * @property {PainterInfo[]} painter
*/
declare type ImagesListInfo = {
  status: number;
  count: number;
  uid?: number;
  pid?: PictureInfo[];
  painter?: PainterInfo[];
}

/**
 * Painter informations.
 * @type {PainterInfo}
 * @property {string} uid
 * @property {string} path
 * @property {number} count
 * @property {PainterInfo[]} pid
*/
declare type PainterInfo = {
  uid: string;
  path: string;
  count: number;
  pid: PictureInfo[]
}