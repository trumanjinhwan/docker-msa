# 초경량 Alpine Linux 기반 Python 3.11 이미지 사용
FROM python:3.11-alpine

# 컨테이너 내 작업 디렉터리 설정
WORKDIR /app

# 패키지 설치를 위한 requirements.txt 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# FastAPI 앱 실행 (Uvicorn)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
