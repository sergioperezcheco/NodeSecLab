# 使用Alpine Linux作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
# 安装必要的编译工具，用于编译本地模块如libxmljs
RUN apk add --no-cache python3 make g++ && \
    npm ci --only=production && \
    apk del python3 make g++

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 5001

# 启动应用
CMD ["node", "app.js"] 