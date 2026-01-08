const express = require('express');
const router = express.Router();

// 1. 각 계층의 클래스(설계도)를 불러옵니다.
const UserController = require('./controllers/user.controller');
const UserService = require('./services/user.service');
const UserRepository = require('./repositories/user.repository');

// ============================================================
// [의존성 주입 (Dependency Injection) 조립 구간]
// Spring의 IoC Container가 하던 일을 여기서 수동으로 합니다.
// ============================================================

// 1단계: Repository 생성 (가장 하위 계층)
const userRepository = new UserRepository();

// 2단계: Service 생성 (Repository를 주입)
const userService = new UserService(userRepository);

// 3단계: Controller 생성 (Service를 주입)
const userController = new UserController(userService);


// ============================================================
// https://ko.wikipedia.org/wiki/%EB%A7%A4%ED%95%91
// 조립된 controller의 메서드와 URL을 연결합니다.
// ============================================================

// GET /api/users/ -> userController.getUsers 실행
// 전체 user 조회
router.get('/', userController.getUsers);

// idx 기준 하나의 user 조회
router.get('/:idx', userController.getUser);

// 회원 가입
router.post('/' , userController.createUser);

// 로그인
router.post('/login', userController.loginUser);

// [추가] 로그아웃
router.post('/logout', userController.logoutUser);

// [추가] 토큰 재발급
router.post('/refresh', userController.refreshToken);

// 회원 정보 수정
router.put('/:idx' , userController.updateUser);

// 회원 탈퇴
router.delete('/:idx' , userController.deleteUser);

// 완성된 라우터를 내보냅니다. (app.js에서 사용)
module.exports = router;