const chalk = require('chalk')
const sm = require('./route-utils');

class Clog{
    constructor(_path = 'Clog:'){
        if(typeof _path !== 'string') throw new Error(`Clog.constructor() expected parameter _path to type string, recieved type ${typeof _path}`);
        this.path = _path;
    }
    setPath(path){
        if(typeof path !== 'string') throw new Error(`Clog.setPath() expected parameter _path to type string, recieved type ${typeof path}`);
        this.path = path;
    }
    info(message, _usePath = false){
        if(!_usePath) console.log(chalk.blue(message))
        else console.log(chalk.blue(`${this.path}: ${message}`));
    }
}