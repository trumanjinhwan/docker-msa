const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;

// PostgreSQL 연결 설정
const pool = new Pool({
    user: 'root',
    host: 'domain2-db',
    database: 'domain2_db',
    password: '1234',
    port: 5432,
});

// DB 연결 및 테이블 생성 재시도 로직 (무한 루프)
const initDB = async () => {
    while (true) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS images (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL,
                    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ DB 연결 및 테이블 생성 완료!');
            break; // 성공 시 루프 탈출
        } catch (err) {
            console.error('⏳ DB 준비 대기 중... 3초 후 재시도합니다.', err.message);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
};
initDB();

// 파일 업로드 설정 (호스트와 마운트된 경로 사용)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/app/uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 업로드된 이미지를 브라우저에서 볼 수 있도록 정적 파일 경로 개방
app.use('/api/uploads', express.static('/app/uploads'));

// [POST] 이미지 업로드 API
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: '파일이 없습니다.' });
    
    try {
        const result = await pool.query(
            'INSERT INTO images (filename) VALUES ($1) RETURNING *',
            [req.file.filename]
        );
        res.json({ message: '업로드 성공!', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [GET] 이미지 목록 조회 API
app.get('/api/images', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM images ORDER BY id DESC');
        res.json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Domain 2 API Server is running on port ${port}`);
});
