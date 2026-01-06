const express = require('express');
const memberRoutes = require('./domains/member/member.routes.js');
const categoryRoutes = require('./domains/category/category.routes.js');
const todoRoutes = require('./domains/todo/todo.routes.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =================================================================
// [미들웨어 (Middleware) 설정]
// Express의 핵심입니다. 요청(req)이 컨트롤러에 도달하기 전에 거쳐가는 관문입니다.
// Spring의 Filter나 Interceptor와 비슷한 역할을 하지만 훨씬 유연하고 보편적으로 쓰입니다.
// =================================================================

// 1. JSON 파싱 미들웨어
// 클라이언트가 보낸 JSON 데이터를 자바스크립트 객체로 변환하여 req.body에 넣어줍니다.
// Spring에서 Jackson 라이브러리가 자동으로 해주던 일을 이 한 줄이 담당합니다.
// 이 코드가 없으면 Controller에서 req.body는 undefined가 됩니다.
app.use(express.json());


// 2. 라우터 미들웨어
// '/api/members'로 시작하는 모든 요청을 memberRoutes 파일로 보냅니다.
// Spring의 Controller 클래스 위에 붙는 @RequestMapping("/api/members")와 같습니다.
app.use('/api/members', memberRoutes);
app.use('/api/catetories', categoryRoutes);
app.use('/api/todos', todoRoutes);


// =================================================================
// [서버 시작]
// =================================================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});