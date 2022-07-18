import {
  readFileSync,
  mkdirSync,
  existsSync
} from 'fs'
import { join } from 'path'

export default {}

/**
 * Configuation Controller.
 * @type {ConfigController}
*/
export class ConfigController {
  private configFolderPath: string = join(__dirname, '../config')
  private configFilePath: string = join(this.configFolderPath, './basic.config.json')
  public configuration!: Config
  
  public constructor() {
    this.ensureConfigFolderExists()
    this.ensureConfigFileExists()
    this.configuration = this.readConfigFile()
  }
  /**
   * Ensure the configuration folder is exists.
   * @return {void}
  */
  private ensureConfigFolderExists(): void {
    if (!existsSync(this.configFolderPath)) {
      console.warn(`[WARN] Configuration folder ${this.configFolderPath} is not exists!`)
      console.info(`[INFO] Creating...`)
      try {
        mkdirSync(this.configFolderPath)
        console.info(`[INFO] created!`)
      } catch(err) {
        throw new Error(`[ERROR] Configuration Folder ${this.configFolderPath} created failed!`)
      }
    }
  }
  /**
   * Ensure the configuration file is exists.
   * @return {void}
  */
  private ensureConfigFileExists(): void {
    if (!existsSync(this.configFilePath)) {
      throw new Error(`COnfiguration file ${this.configFilePath} not exists, ensure it has not been created!`)
    }
  }
  /**
   * Read and get configuration.
   * @return {Config}
  */
  private readConfigFile(): Config {
    const configuration: Config = JSON.parse(readFileSync(this.configFilePath).toString())
    if (!configuration.port) throw new Error(`Configuration file ${this.configFilePath} has not been configured, please ensure it has been configured.`)
    return configuration
  }
}