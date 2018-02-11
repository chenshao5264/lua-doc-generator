const options = process.argv.splice(2);
const filePath = options[0];
if (!filePath) {
    console.error('未设置文件路径');
    return;
}
let outFile = options[1];

const path = require("path");
const fs = require("fs");
const readline = require('readline'); 
const moment = require('moment');
moment.locale('zh-cn');


const fileName = path.basename(filePath);

// 设置输出路径
if (!outFile) {
    outFile = path.dirname(filePath);
    outFile = path.resolve(outFile);
}
outFile += '/' + fileName + '.md'

console.log(outFile)

let apis = [];

let api = {
    brief: '',
    params: [],
    return: null,
    //return: {type: '', explain: ''},
};

let content = '';

let start = function() {
    const fRead = fs.createReadStream(filePath);
    let objReadline = readline.createInterface({  
        input: fRead
    });  
    
    let docs = [];
    let one  = [];
    let start = false;
    let last = false;
    objReadline.on('line', (line) => { 
        line = line.replace(/^\s+|\s+$/g,"");
        if (line === '-- /**') { // 开始
            one = [];
            start = true;
            one.push(line)
        } else if (line === '--  */') { // 结束
            if (start) {
                start = false;
                one.push(line)
    
                last = true;
            }
        } else {
            if (start) {
                one.push(line)
            }
            if (last) { // 函数声明行
                last = false;
                one.push(line)
                docs.push(one);
            }
        }
    });  

    objReadline.on('close', () => {
    
        for (let i = 0; i < docs.length; ++i) {
            parserAPI(docs[i]);
        }  
        
        content += '修改日期: ' + moment().format('YYYY-MM-DD HH:mm:ss') + '\n\r';
        content += '### 0. 索引\n\r'
        for (let i = 0 ; i < apis.length; ++i) {
            content += '[' + (i + 1) + '. ' + apis[i].name + ']' + '(#' + (i + 1) + ')\n'
        } 
        content += '\n\r';
        content += '---\n\r'
     
        for (let i = 0 ; i < apis.length; ++i) {
            appendContent(apis[i], i + 1);
        }

        fs.writeFileSync(outFile, content, {encoding: 'utf8', flag: 'w'});
    });
}


start();



const BRIEF_FORMAT  = '--  *';
const PARAM_FORMAT  = '--  * @param';
const RETURN_FORMAT = '--  * @return';


const type_reg = /^{.*?}/
const parserParam = function(param) {
    let detail = param.substr(PARAM_FORMAT.length).replace(/^\s+|\s+$/g,"");
    // 类型
    let type = detail.match(type_reg);
    if (type == null) {
        return;
    }

    // 字段
    let p2 = detail.substr((type + '').length).replace(/^\s+|\s+$/g, "").split(' ');
    let field   = p2[0]; // 不能带空格
    let explain = p2[1]; // 不能带空格

    p2.splice(0, 2) 
    let remark  = p2.join(''); // 防止备注中有空格

    type = type[0];
    let canNull = false;
    if (type.indexOf('null') === -1) {
        type = type.substr(1, type.length - 2);
    } else {
        canNull = true;

        let s = type.indexOf('|')
        if (s > 0) {
            type = type.substr(1, s - 1).replace(/^\s+|\s+$/g,"");
        }
    }

    api.params.push({
       type: type,
       canNull: canNull,
       field: field,
       explain: explain,
       remark: remark,
    })
}

const parserAPI = function(t) {
    api = {
        name: '',
        brief: '',
        params: [],
        return: null,
    };

    for (let i = 0; i < t.length - 2; ++i) {
        if (t[i].indexOf(PARAM_FORMAT) !== -1) {
            parserParam(t[i])
        } else if (t[i].indexOf(RETURN_FORMAT) !== -1) {
            let result = t[i].substr(RETURN_FORMAT.length).replace(/^\s+|\s+$/g,"");
            // 类型
            let type = result.match(type_reg);
            if (type) {
                api.return = {}
                api.return.type = type[0].substr(1, type[0].length - 2);
                api.return.explain = result.substr(type[0].length).replace(/^\s+|\s+$/g,"");
            }
        } else if (t[i].indexOf(BRIEF_FORMAT) !== -1) {
            api.brief = t[i].substr(BRIEF_FORMAT.length).replace(/^\s+|\s+$/g,"");
        }
    }    

    // 获取函数名字
    let last = t[t.length - 1];
    let s = last.match(/:.*\(/);
    if (s) {
        api.name  = s[0].substr(1, s[0].length - 2);
    } else {
        s = last.match(/\..*\(/);
        api.name  = s[0].substr(1, s[0].length - 2);
    }
    
    apis.push(api);
}

const appendContent = function(api, idx) {
    content += '<h3><span id =' + idx + '>' 
    content += idx + '. ' + api.name
    content += '</span></h3>\n\r'
    content += '__简要描述__\n\r';
    content += '- ';
    content += api.brief;
    content += '\n\r';
    content += '__参数__\n\r';
    if (api.params.length === 0) {
        content += '- 无参数\n\r'
    } else {
        content += '|参数名|类型|必选|说明|备注|\n'
        content += '|:--|:--|:--|:--|:--|\n'
        for (let i = 0; i < api.params.length; ++i) {
            let param = api.params[i];
            content += '|' + param.field
            content += '|' + param.type
            if (param.canNull) {
                content += '|' + '否'
            } else {
                content += '|' + '是'
            }
            content += '|' + param.explain
            content += '|' + param.remark
            content += '|\n'
        }
    }

    content += '\n\r'
    content += '__返回值说明__\n\r'
    if (api.return) {
        content += '|类型|说明|\n'
        content += '|:--|:--|\n'
        content += '|' + api.return.type
        content += '|' + api.return.explain
        content += '|\n\r'
    } else {
        content += '- 无返回值\n\r'
    }

    content += '---\n'
}

