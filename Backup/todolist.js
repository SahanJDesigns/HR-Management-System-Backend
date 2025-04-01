const pool = require('./dbConfig');
const jwt = require('jsonwebtoken');
const secretKey = '1234';

const getTodoList = async (req, res) => {
    try{
        const token = req.cookies['user'];
        if (!token)return res.status(401).json({error: 'No token fonud'});
        const verified = jwt.verify(token,secretKey);
        const user_id = verified.id;
        const Query = "select * from todolist where user_id = ?";
        const [todolist] = await pool.query(Query,[user_id]);
        res.status(200).json({todolist});
    }catch(err){
        console.error(err);
        res.status(400).json({error: 'Invalid token'});
    }
}

const deleteTodo = async (req, res) => {
    try{
        const token = req.cookies['user'];
        if (!token)return res.status(401).json({error: 'No token fonud'});
        jwt.verify(token,secretKey);

        const {todo_id} = req.body;
        const query = "delete from todolist where todo_id = ?";
        await pool.query(query,[todo_id]);
        res.status(200).json({message:'delete succsessful'});
    }catch(err){
        res.status(400).json({error: 'Invalid token'});
    }
}
const addTodo = async (req, res) => {
    try{
        const token = req.cookies['user'];
        if (!token)return res.status(401).json({error: 'No token fonud'});
        jwt.verify(token,secretKey);
        const todo = req.body;
        const query = "insert into todolist (todo_id,user_id,task,due_date,status) values (?,?,?,?,?);";
        await pool.query(query,[todo.todo_id,todo.user_id,todo.task,todo.due_date,todo.status]);
        res.status(200).json({message:'add succsessful'});
    }catch(err){
        console.error(err);
        res.status(400).json({error: 'Invalid token'});
    }
}

module.exports = {
    getTodoList,
    addTodo,
    deleteTodo
}