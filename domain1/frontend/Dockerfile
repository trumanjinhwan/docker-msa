# 초경량 Apache(httpd) Alpine 이미지 사용
FROM httpd:alpine

# Apache의 리버스 프록시 모듈(mod_proxy, mod_proxy_http) 주석(#) 해제하여 활성화
RUN sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# 우리가 만든 커스텀 설정 파일을 Apache 설정 폴더로 복사
COPY my-httpd.conf /usr/local/apache2/conf/extra/my-httpd.conf

# 메인 설정 파일(httpd.conf) 마지막 줄에 커스텀 설정 파일을 포함(Include)하도록 추가
RUN echo "Include conf/extra/my-httpd.conf" >> /usr/local/apache2/conf/httpd.conf

# 우리가 만든 HTML 파일을 Apache 웹 루트 디렉터리로 복사
COPY index.html /usr/local/apache2/htdocs/index.html

EXPOSE 80