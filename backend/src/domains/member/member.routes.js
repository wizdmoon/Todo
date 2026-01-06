const express = require('express');
const router = express.Router();

// 1. 각 계층의 클래스(설계도)를 불러옵니다.
const MemberController = require('./controllers/member.controller');
const MemberService = require('./services/member.service');
const MemberRepository = require('./repositories/member.repository');

// ============================================================
// [의존성 주입 (Dependency Injection) 조립 구간]
// Spring의 IoC Container가 하던 일을 여기서 수동으로 합니다.
// ============================================================

// 1단계: Repository 생성 (가장 하위 계층)
const memberRepository = new MemberRepository();

// 2단계: Service 생성 (Repository를 주입)
const memberService = new MemberService(memberRepository);

// 3단계: Controller 생성 (Service를 주입)
const memberController = new MemberController(memberService);


// ============================================================
// https://ko.wikipedia.org/wiki/%EB%A7%A4%ED%95%91
// 조립된 controller의 메서드와 URL을 연결합니다.
// ============================================================

// GET /api/members/ -> memberController.getMembers 실행
// 전체 member 조회
router.get('/', memberController.getMembers);

// idx 기준 하나의 member 조회
router.get('/:idx', memberController.getMember);

// 회원 가입
router.post('/' , memberController.createMember);

// 로그인
router.post('/login', memberController.loginMember);

// 회원 정보 수정
router.put('/:idx' , memberController.updateMember);

// 회원 탈퇴
router.delete('/:idx' , memberController.deleteMember);

// 완성된 라우터를 내보냅니다. (app.js에서 사용)
module.exports = router;