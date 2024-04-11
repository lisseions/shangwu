

import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';
import log from '../utils/log';
import chalk from "chalk";

const getNpmInfo = async (npmName: string) => {
    const npmUrl = 'https://registry.npmjs.org/' + npmName
    let res = {}
    try {
      res = await axios.get(npmUrl)
    } catch (err) {
      log.error(err as string)
    }
    return res
}
const getNpmLatestVersion = async (npmName: string) => {
    // data['dist-tags'].latest 为最新版本号
    const { data } = (await getNpmInfo(npmName)) as AxiosResponse
    return data['dist-tags'].latest
}
export const checkVersion = async (name: string, curVersion: string) => {
    const latestVersion = await getNpmLatestVersion(name)
    const need = lodash.gt(latestVersion, curVersion)
    if(need) {
      log.info(`检测到 shangwu 最新版:${chalk.blueBright(latestVersion)} 当前版本:${chalk.blueBright(curVersion)} ~`)
      log.info(`可使用 ${chalk.yellow('pnpm')} install shangwul-cli@latest 更新 ~`)
    }
    return need
}

