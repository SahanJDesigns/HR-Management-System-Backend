const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { login,signup,getUsers,deleteUser,updateUser } = require('./user');
const { getJobTitles,getPayGrades,getSupervisors,getDepartments,getBranches } = require('./jobInfo');
const {createEmployee } = require('./CreateEmployee');
const { getTodoList,addTodo, deleteTodo, } = require('./todolist');
const { getEmployeeLeaves, updateLeaveStatus, addLeaveRequest, getLeaveTypes, getLeaveRequestofUser } = require('./leaverequests');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/uploads', express.static('uploads'));
// Multer for handling profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/login',login)
app.post('/signup',signup)
app.get('/user',getUsers)
app.delete('/user',deleteUser)
app.put('/user',updateUser)

app.post('/createEmployee', upload.single('profilePic'), createEmployee);

app.get('/getJobTitles', getJobTitles);
app.get('/getPayGrades', getPayGrades);
app.get('/getSupervisors', getSupervisors);
app.get('/getDepartments', getDepartments);
app.get('/getBranches', getBranches);

app.get('/todolist',getTodoList);
app.delete('/todolist',deleteTodo);
app.post('/todolist',addTodo);

app.get('/leaves', getEmployeeLeaves);
app.put('/leaves', updateLeaveStatus);
app.post('/leaves', addLeaveRequest);
app.get('/leavetypes', getLeaveTypes);
app.get('/leaverequest', getLeaveRequestofUser);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
