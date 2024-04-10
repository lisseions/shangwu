import { Command } from 'commander'// 这里我们用 dawei 当作我的指令名称// 命令行中使用 dawei xxx 即可触发const program = new Command('dawei');
import { version } from '../package.json'
import create from './command/create'

// 命令行中使用 dawei xxx 即可触发
const program = new Command('shangwu');
program.version(version, '-v --version')

program
  .command('create')
  .description('创建一个新项目')
  .argument('[name]', '项目名称')
  .action(async (dirName) => {
    await create(dirName);
});

program.parse();