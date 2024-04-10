import { select, input } from '@inquirer/prompts';
import { clone } from '../utils/clone';
import path from 'path';
import fs from 'fs-extra';
import log from '../utils/log';
import { name, version} from '../../package.json';
import chalk from "chalk";
import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';

export interface TemplateInfo {
    name: string; // 项目名称
    downloadUrl: string; // 下载地址
    description: string; // 项目描述
    branch: string; // 项目分支
}
// 这里保存之前开发的模板
export const templates: Map<string, TemplateInfo> = new Map(
    [
        ["Vue3-Typescript-template1", {
            name: "admin-template",
            downloadUrl: 'git@gitee.com:sohucw/admin-pro.git',
            description: 'Vue3技术栈开发模板',
            branch: 'dev10'
        }],
        ["Vue3-Typescript-template2", {
            name: "admin-template",
            downloadUrl: 'git@gitee.com:sohucw/admin-pro.git',
            description: 'Vue3技术栈开发模板',
            branch: 'dev11'
        }]
    ]
)
// 判断文件是否覆盖
export const isOverwrite = async (fileName: string) => {
    log.warning(`${fileName} 文件已存在 !`)
    return select({
        message: '是否覆盖原文件: ',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false }
        ]
    });
}
// 检查npm更新
export const getNpmInfo = async (npmName: string) => {
    const npmUrl = 'https://registry.npmjs.org/' + npmName
    let res = {}
    try {
      res = await axios.get(npmUrl)
    } catch (err) {
      log.error(err as string)
    }
    return res
}
export const getNpmLatestVersion = async (npmName: string) => {
    // data['dist-tags'].latest 为最新版本号
    const { data } = (await getNpmInfo(npmName)) as AxiosResponse
    return data['dist-tags'].latest
}
export const checkVersion = async (name: string, curVersion: string) => {
    const latestVersion = await getNpmLatestVersion(name)
    const need = lodash.gt(latestVersion, curVersion)
    if(need) {
      log.info(`检测到 dawei 最新版:${chalk.blueBright(latestVersion)} 当前版本:${chalk.blueBright(curVersion)} ~`)
      log.info(`可使用 ${chalk.yellow('pnpm')} install dawei-cli@latest 更新 ~`)
    }
    return need
}
export default async function create(prjName: string) {
    // 需要将 map 处理成 @inquirer/prompts select 需要的形式
    const templateList = [...templates.entries()].map((item: [string, TemplateInfo]) => {
        const [name, info] = item;
        return {
            name,
            value: name,
            description: info.description
        }
    })

    // 文件名称未传入需要输入
    if (!prjName) prjName = await input({ message: '请输入项目名称' });

    // 如果文件已存在需要让用户判断是否覆盖原文件
    const filePath = path.resolve(process.cwd(), prjName)
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(prjName)
        if (run) {
            await fs.remove(filePath)
        } else {
            return // 不覆盖直接结束
        }
    }

    // 检查版本更新
    await checkVersion(name,version)

    // 选择模板
    const templateName = await select({
        message: '请选择需要初始化的模板:',
        choices: templateList,
    });
    // 下载模板
    const gitRepoInfo = templates.get(templateName)
    if (gitRepoInfo) {
        await clone(gitRepoInfo.downloadUrl, prjName, ['-b', `${gitRepoInfo.branch}`])
    } else {
        log.error(`${templateName} 模板不存在`)
    }
}
