const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  // password: process.env.REDIS_PASSWORD // 비밀번호 설정 시 주석 해제
});

// 이벤트 리스너 등록
redisClient.on('connect', () => {
  console.log('레디스 연결');
});

redisClient.on('error', (err) => {
  console.error('레디스 에러', err);
});

// 연결 시작 (비동기지만, 모듈 로드 시 바로 시도)
redisClient.connect();

module.exports = redisClient;