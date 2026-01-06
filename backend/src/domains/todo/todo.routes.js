const express = require('express');
const router = express.Router();

// 1. 각 계층의 클래스(설계도)를 불러옵니다.
const TodoController = require('./controllers/todo.controller');
const TodoService = require('./services/todo.service');
const TodoRepository = require('./repositories/todo.repository');

// 1단계: Repository 생성 (가장 하위 계층)
const todoRepository = new TodoRepository();

// 2단계: Service 생성 (Repository를 주입)
const todoService = new TodoService(todoRepository);

// 3단계: Controller 생성 (Service를 주입)
const todoController = new TodoController(todoService);

// todo 추가
router.post('/', todoController.createTodo);

router.put('/:tidx', todoController.updateTodo);

router.put('/:tidx/state', todoController.updateState);

router.delete('/:tidx', todoController.deleteTodo);

module.exports = router;