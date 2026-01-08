const express = require('express');
const userRoutes = require('./domains/user/user.routes.js');
const categoryRoutes = require('./domains/category/category.routes.js');
const todoRoutes = require('./domains/todo/todo.routes.js');
const dotenv = require('dotenv');

// require('./common/config/redis.config.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});