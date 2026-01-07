const express = require('express');
const router = express.Router();

// 1. 각 계층의 클래스(설계도)를 불러옵니다.
const CategoryController = require('./controllers/category.controller');
const CategoryService = require('./services/category.service');
const CategoryRepository = require('./repositories/category.repository');

// ============================================================
// [의존성 주입 (Dependency Injection) 조립 구간]
// Spring의 IoC Container가 하던 일을 여기서 수동으로 합니다.
// ============================================================

// 1단계: Repository 생성 (가장 하위 계층)
const categoryRepository = new CategoryRepository();

// 2단계: Service 생성 (Repository를 주입)
const categoryService = new CategoryService(categoryRepository);

// 3단계: Controller 생성 (Service를 주입)
const categoryController = new CategoryController(categoryService);


// ============================================================
// https://ko.wikipedia.org/wiki/%EB%A7%A4%ED%95%91
// 조립된 controller의 메서드와 URL을 연결합니다.
// ============================================================

// GET /api/members/ -> memberController.getMembers 실행
// 전체 member 조회
router.get('/', categoryController.getCategories);

router.post('/', categoryController.createCategory);

// idx 기준 하나의 member 조회
router.get('/:uidx', categoryController.getCatetory);

router.get('/:uidx/:cidx', categoryController.getOneCatetory);

router.put('/:cidx', categoryController.updateCategory);

router.delete('/:cidx', categoryController.deleteCategory);

module.exports = router;