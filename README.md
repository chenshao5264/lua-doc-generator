### 快速生成某个lua文件对外的api

#### 初衷
1. 提升提供模块功能者的编程素质
2. 间接提高代码质量，最简单的方式提供给其他模块使用
2. 减少沟通成本，便于后期维护
3. 减少重复编写代码的可能性

#### 前提
* 注释方式
```
-- /**
--  * 用户登录接口
--  * @param  {string} account 用户登录帐号
--  * @param  {string | null} password 用户登录密码 为空时，使用本地保存的密码登录
--  * @return {number} 登录结果
--  */
function M:login(account, password) 

end
```

1. __-- /**__
用于注释开始。

2. __--  *__
用于介绍此api功能。

3. __--  * @param__
用于参数介绍。
    1. ___{string}___ 参数类型。参数类型用{}包裹, 若参数可以为空，则追加 - __| null__ 表示。eg: ___{string | null}___
    2. ___password___ 参数说明。 eg: 用户登录密码
    3. ___用户登录帐号___ 参数备注。eg: 为空时，使用本地保存的密码登录

> 三个参数介绍之间用空格分隔

4. __--  * @return__
用户返回值介绍。
    1. ___{number}___ 参数类型。
    2. __登录结果__ 参数说明。

5. __--  */__
用于注释结束。
> 下一行紧跟函数声明，否则无法获取到api名。

#### 使用环境
node.js

#### 使用方法

1. 将lua文件拷贝到src目录下
2. 
```
cd '当前目录'
node ./app.js
```
3. 对应的md文件生成在out目录下
4. 应用于gitbook的SUMMARY生成在out目录下
5. cd ./out
6. gitbook init
7. gitbook serve
8. 浏览器访问 http://localhost:4000
