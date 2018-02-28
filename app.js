const fs = require("fs");
const path = require("path");
const single = require('./single');


function getFileList(path, filesList, walkDir) {
    readFile(path, filesList, walkDir);
    return filesList;
}


let dirs = {};

//遍历读取文件
function readFile(path, filesList, walkDir) {
    var files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file) {
        var states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {

            let t = path + '/' + file;
            t = t.substr(5, t.length - 5);
            t = __dirname + '/out' + t;

            // 判断目录是否存在
            if (fs.existsSync(t) === false) {
                fs.mkdirSync(t);
            }

            readFile(path + '/' + file, filesList, walkDir);
        }
        else {
            var fullPath = path + '/' + file;
            let name = fullPath.substring(walkDir.length + 1, fullPath.length);
            filesList.push(name);
            
            let arr = name.toString().split("/");  
            function generateKey(root, i) {
                if (i === arr.length - 1) {
                    if (i === 0) {
                        if (root[0] === undefined) {
                            root[0] = {};
                            root[0].files = [];
                        }
                        root[0].files.push(arr[i]);
                    } else {
                        root.files.push(arr[i]);
                    }
                    return;
                }
                let k = arr[i];
                if (root[k] === undefined) {
                    root[k] = {};
                    root[k].files = [];
                }
                generateKey(root[k], i + 1);
            }
            generateKey(dirs, 0);
        }
    }
}

let filesList = [];
filesList = getFileList("./src", filesList, "./src");

for(let i = 0; i < filesList.length; ++i) {
    single.run(__dirname + '/src/' + filesList[i], path.dirname(__dirname + '/out/' + filesList[i]));
}


let heap = [];
function walk(obj) {
    if (typeof obj !== 'object') {
        return;
    }

    for(let k in obj) {
        if (k === 'files') {
            heap.push(obj[k]);
        } else {
            heap.push(k);
            walk(obj[k])
        }
    }
}

walk(dirs)

let tmp = [];

let tab = 0;
let content = '';
for (let i = 0; i < heap.length; ++i) {
    let t = heap[i];
    tmp.push(t);

if (tmp.length % 2 === 0) {
    if (typeof t === 'object') {
        tab = 0;
        let d = '';
        for (let j = 0; j < tmp.length; ++j) {
            if (typeof tmp[j] === 'object') {

                for (let k = 0; k < tmp[j].length; ++k) {
                    for (let s = 0; s < tab; ++s) {
                        content += '    ';
                    }
                    content += '* ';
                    content += '[';
                    content += tmp[j][k];
                    content += ']';
                    content += '(';

                    content += d + tmp[j][k] + '.md';
                    content += ')';
                    content += '\n';
                }
                tab -= 1;
            } else {
                
                if (tmp[j] != 0) {

                    for (let s = 0; s < tab; ++s) {
                        content += '    ';
                    }
                    content += '* ';
                    content += tmp[j];
                    content += '\n';
                    d += tmp[j] + '/';
                    tab += 1;
                }
                
            }
        }
        tmp = [];
    }
}
    
}

fs.writeFileSync(__dirname + '/out/SUMMARY.md', content, { encoding: 'utf8', flag: 'w' });