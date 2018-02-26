
local M = {}

-- /**
--  * 构造函数
--  */
function M:ctor()

end

function M:empty() 

end

-- /**
--  * 保存帐号信息
--  * @return {number}
--  */
function M:save() 

end

-- /**
--  * 用户登录接口
--  * @param  {string} account 用户登录帐号
--  * @param  {string | null} password 用户登录密码 为空时，使用本地保存的密码登录
--  * @return {number} 登录结果
--  */
function M:login(account, password) 

end

-- /**
--  * 登出
--  * @return  {[boolean, string]} 是否登出成功；错误信息
--  */
function M:logout() 

end

return M