# 使用官方的 Node.js 映像檔作為基本映像檔
FROM node:18-alpine

# 設定容器內的工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 檔案
COPY package*.json ./

# 安裝應用程式相依套件
RUN npm install

# 複製其餘的應用程式檔案
COPY . .

# 設定 Next.js 應用程式運行的埠號
EXPOSE 3001

# 啟動 Next.js 應用程式
CMD ["npm", "run" , "dev"]