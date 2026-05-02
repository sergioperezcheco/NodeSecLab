# NodeSecLab

Web 安全靶场，基于 Node.js + Express + MySQL 构建，涵盖 10 大类常见 Web 漏洞，共 37 个关卡。

## 漏洞类型

| 类型 | 关卡数 | 路径 | 说明 |
|------|--------|------|------|
| SQL 注入 | 7 | `/sqli` | 联合查询、布尔盲注、时间盲注、二次注入、报错注入 |
| XSS | 6 | `/xss` | 反射型、存储型、URL参数、输入框属性、过滤绕过、Style标签 |
| 文件上传 | 6 | `/upload` | 无限制、后缀黑名单、前端验证、大小写绕过、双写绕过、Content-Type绕过 |
| 命令执行 | 5 | `/command` | 命令注入、过滤绕过、eval代码执行、模板注入、反序列化 |
| CSRF | 3 | `/csrf` | POST型、Token验证、GET型 |
| 文件包含 | 2 | `/include` | 无限制文件包含、目录遍历过滤 |
| 文件下载 | 2 | `/download` | 路径遍历、basename过滤 |
| XML 注入 | 2 | `/xml` | XXE外部实体注入、XPath注入 |
| 业务逻辑 | 2 | `/logic` | 水平/垂直越权、重放攻击 |
| 中间件漏洞 | 2 | `/middleware` | 原型污染、Cookie解析绕过 |

## 快速开始

### 方式一：Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/your-username/NodeSecLab.git
cd NodeSecLab

# 一键启动
docker-compose up -d

# 访问 http://localhost:3000
```

### 方式二：本地 npm 部署

**环境要求：** Node.js >= 18，MySQL >= 5.7

```bash
# 克隆项目
git clone https://github.com/your-username/NodeSecLab.git
cd NodeSecLab

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接和 AI 助手（可选）

# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS web_security_lab;"

# 启动服务
npm start
# 或开发模式（自动重启）
npm run dev

# 访问 http://localhost:3000
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | `3000` |
| `DB_HOST` | 数据库地址 | `localhost` |
| `DB_USER` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | 空 |
| `DB_NAME` | 数据库名 | `web_security_lab` |
| `AI_CHAT_ENABLED` | 是否启用 AI 助手 | `true` |
| `AI_CHAT_BASE_URL` | AI API 地址 | - |
| `AI_CHAT_API_KEY` | AI API 密钥 | - |
| `AI_CHAT_MODEL` | AI 模型名称 | - |

## 项目结构

```
NodeSecLab/
├── app.js                  # 应用入口
├── config/
│   └── db.js               # 数据库配置与初始化
├── routes/                 # 路由定义
├── controllers/            # 漏洞逻辑（按类型和关卡划分）
├── views/                  # EJS 模板页面
├── public/
│   ├── css/                # 样式文件
│   ├── js/                 # 前端脚本
│   ├── uploads/            # 上传文件目录
│   ├── downloads/          # 下载文件目录
│   └── includes/           # 文件包含测试文件
├── docs/
│   └── writeups.md         # 各关卡题解
├── docker-compose.yml      # Docker 编排文件
├── Dockerfile              # Docker 镜像定义
└── .env.example            # 环境变量示例
```

## 题解

各关卡的解题思路和 Payload 请参阅 [题解文档](docs/writeups.md)。

## 免责声明

本项目仅供安全学习和教育用途。请勿将学到的技术用于非法目的。使用本项目进行的任何操作，需自行承担风险。
