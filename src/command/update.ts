import log from '../utils/log';
import ora from 'ora';
import chalk from "chalk";
import process from 'child_process';

const spinner = ora({
    text: 'Updating...',
    spinner: {
        interval: 300, // 变换时间 ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item=>chalk.blue(item)) // 设置加载动画
      }
});
export function update() {
    spinner.start();
    process.exec('npm install shangwul-cli -g', (error) => {
        spinner.stop();
        if(!error) {
            console.log(chalk.green('更新成功'));
        } else {
            console.log(chalk.red(error));
        }
    })
}