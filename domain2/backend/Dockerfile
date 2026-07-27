# 초경량 Node.js Alpine 이미지 사용
FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package.json .
RUN npm install

# 소스 코드 복사
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

