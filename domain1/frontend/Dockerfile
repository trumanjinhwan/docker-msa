# 초경량 Nginx Alpine 이미지 사용
FROM nginx:alpine

# 우리가 만든 설정 파일로 Nginx 기본 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 우리가 만든 HTML 파일을 Nginx 웹 루트 디렉터리로 복사
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80
