const express = require('express');
const router = express.Router();

const TodoController = require('./controllers/todo.controller');
const TodoService = require('./services/todo.service');
const TodoRepository = require('./repositories/todo.repository');

const todoRepository = new TodoRepository();

const todoService = new TodoService(todoRepository);

const todoController = new TodoController(todoService);

router.post('/', todoController.createTodo);

router.put('/:tidx', todoController.updateTodo);

router.put('/:tidx/state', todoController.updateState);

router.delete('/:tidx', todoController.deleteTodo);

// 조회
router.get('/:uidx', todoController.getTodos);


module.exports = router;