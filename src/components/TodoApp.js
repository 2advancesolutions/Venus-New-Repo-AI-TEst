import React, { useState } from 'react';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    if (text.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>My Todo List</h1>
        <p className="todo-count">
          {todos.filter(todo => !todo.completed).length} items remaining
        </p>
      </header>
      
      <AddTodo onAdd={addTodo} />
      
      {todos.length > 0 ? (
        <TodoList 
          todos={todos} 
          onToggle={toggleTodo} 
          onDelete={deleteTodo} 
        />
      ) : (
        <div className="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;