const express = require('express');
const cors = require('cors');
const taskRouter = require('./routers/taskRouter');

const app = express();
const authRouter = require('./routers/authRouter');

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);

app.get('/', (req: any, res: any) => {
    res.send('Task Management API is running good');
});

module.exports = app;
