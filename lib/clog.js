const statusMessage = require('./route-utils');

class Clog{
    constructor(_path = 'Clog'){
        this.setPath(_path);
        this.Colors = {
            Reset: "\x1b[0m",
            Bright: "\x1b[1m",
            Dim: "\x1b[2m",
            Underscore: "\x1b[4m",
            Blink: "\x1b[5m",
            Reverse: "\x1b[7m",
            Hidden: "\x1b[8m",
            black: "\x1b[30m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            BgBlack: "\x1b[40m",
            BgRed: "\x1b[41m",
            BgGreen: "\x1b[42m",
            BgYellow: "\x1b[43m",
            BgBlue: "\x1b[44m",
            BgMagenta: "\x1b[45m",
            BgCyan: "\x1b[46m",
            BgWhite: "\x1b[47m",
        }
    }
    setPath(path){
        if(typeof path !== 'string') throw new Error(`Clog.setPath() expected parameter _path to type string, recieved type ${typeof path}`);
        this.path = path;
    }
    log(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['white']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['white']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    info(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['blue']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['blue']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    success(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['green']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['green']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    warn(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['yellow']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['yellow']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    error(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['red']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['red']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    critical(message, _usePath = false){
        if(!_usePath) console.log(`${this.Colors['BgRed']}${this.Colors['black']}${message}${this.Colors['Reset']}`);
        else console.log(`${this.Colors['BgRed']}${this.Colors['black']}${this.path}: ${message}${this.Colors['Reset']}`);
    }
    httpStatus(status, _message){
        let message = _message ? `: ${_message}` : '';
        let sM = statusMessage(status)
        let bg, fg, fgA;
        switch (String(status).charAt(0)){
            case '1':
                bg = 'BgWhite'; fg = 'black'; fgA = 'white';
                break;
            case '2':
                bg = 'BgGreen'; fg = 'black'; fgA = 'green';
                break
            case '3':
                bg = 'BgYellow'; fg = 'black'; fgA = 'yellow';
                break;
            case '4':
                bg = 'BgYellow'; fg = 'black'; fgA = 'yellow';
                break;
            case '5':
                bg = 'BgRed'; fg = 'white'; fgA = 'red';
                break;
            default:
                console.log(`${this.Colors['BgYellow']}${this.Colors['black']} ? ${status} ${this.path} ? ${this.Colors['Reset']}${message}`);
                break;
        }
        if(bg) console.log(`${this.Colors[bg]}${this.Colors[fg]} ${status} ${this.Colors['Underscore']}${this.path} ${this.Colors['Reset']}${this.Colors[fgA]}${message}${this.Colors['Reset']}`);
    }
}

module.exports = Clog;