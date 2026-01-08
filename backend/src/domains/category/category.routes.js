const express = require('express');
const router = express.Router();

const CategoryController = require('./controllers/category.controller');
const CategoryService = require('./services/category.service');
const CategoryRepository = require('./repositories/category.repository');

const categoryRepository = new CategoryRepository();

const categoryService = new CategoryService(categoryRepository);

const categoryController = new CategoryController(categoryService);

router.get('/', categoryController.getCategories);

router.post('/', categoryController.createCategory);

// idx 기준 하나의 member 조회
router.get('/:uidx', categoryController.getCategory);

router.get('/:uidx/:cidx', categoryController.getOneCatetory);

router.put('/:cidx', categoryController.updateCategory);

router.delete('/:cidx', categoryController.deleteCategory);

module.exports = router;