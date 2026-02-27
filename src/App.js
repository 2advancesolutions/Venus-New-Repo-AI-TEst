import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>📝 My Todo List</h1>
          <p className="subtitle">Stay organized and productive</p>
        </header>

        <AddTodo onAdd={addTodo} />

        <div className="stats">
          <span className="stat">
            Total: <strong>{totalCount}</strong>
          </span>
          <span className="stat">
            Completed: <strong>{completedCount}</strong>
          </span>
          <span className="stat">
            Remaining: <strong>{totalCount - completedCount}</strong>
          </span>
        </div>

        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

        {todos.length === 0 && (
          <div className="empty-state">
            <p>🎉 No todos yet! Add one above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
