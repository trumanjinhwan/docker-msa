from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
import time

# MariaDB 연결 설정
DATABASE_URL = "mysql+pymysql://myuser:mypassword@domain1-db:3306/domain1_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 데이터베이스 모델 정의
class DomainText(Base):
    __tablename__ = "domain1_texts"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(255), default="Domain 1")

# DB 연결 재시도 로직 (MariaDB가 완전히 켜질 때까지 대기)
while True:
    try:
        Base.metadata.create_all(bind=engine)
        print("DB 연결 및 테이블 생성 완료!")
        break
    except OperationalError:
        print("DB가 아직 준비되지 않았습니다. 3초 후 재시도합니다...")
        time.sleep(3)

app = FastAPI(title="Domain 1 API")

class TextCreate(BaseModel):
    content: str = "Domain 1"

@app.post("/api/texts")
def create_text(item: TextCreate):
    db = SessionLocal()
    new_text = DomainText(content=item.content)
    db.add(new_text)
    db.commit()
    db.refresh(new_text)
    db.close()
    return {"message": "생성 성공", "data": new_text}

@app.get("/api/texts")
def get_texts():
    db = SessionLocal()
    texts = db.query(DomainText).all()
    db.close()
    return {"data": texts}
