const pool = require('../config/dbConfig');

const ToDoList = {
    async getTodoList(user_id) { 
        const query = "SELECT * FROM todolist WHERE user_id = ?";
        const [todolist] = await pool.query(query, [user_id]);
        return todolist
    },

    async addTodo(todo_id, user_id, task, due_date, status) {  
        const query = "INSERT INTO todolist (todo_id, user_id, task, due_date, status) VALUES (?,?,?,?,?);";
        const result = await pool.query(query, [todo_id, user_id, task, due_date, status]);
        return result.affectedRows > 0;
    },

    async deleteTodo(todo_id) {
        const query = "DELETE FROM todolist WHERE todo_id = ?";
        const result = await pool.query(query, [todo_id]);
        return result.affectedRows > 0;
    }
};

module.exports = ToDoList;
