const express = require('express');
const TodoController = require('../controllers/todoController')
const {grantPrivileges} = require('../middleware/authentification');

const toDoRouter = express.Router();

toDoRouter.post('/addtodo',grantPrivileges('Employee'), TodoController.addTodo);
toDoRouter.get('/',grantPrivileges('Employee'), TodoController.getTodoList);
toDoRouter.delete('/:id',grantPrivileges('Employee'), TodoController.deleteTodo);

module.exports = { toDoRouter };