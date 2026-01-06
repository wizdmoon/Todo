const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// DB 연결 풀 생성
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 연결 확인 로그 (선택 사항)
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ DB Error', err);
});

// ⭐ 핵심: pool 객체 자체를 그대로 내보냅니다.
module.exports = pool;