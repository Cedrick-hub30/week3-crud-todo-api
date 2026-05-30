require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

// temporary in-memory data store
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// get all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// get active todos only (must be before /:id route)
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(t => !t.completed);
  res.status(200).json(activeTodos);
});

// get completed todos only
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter(t => t.completed);
  res.json(completed);
});

// get a single todo by id
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  res.status(200).json(todo);
});

// create a new todo — task field is required
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (!task) return res.status(400).json({ error: 'task field is required' });

  const newTodo = {
    id: todos.length + 1,
    task: task,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// partial update — e.g. mark as completed
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// delete a todo by id
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
});

// global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));