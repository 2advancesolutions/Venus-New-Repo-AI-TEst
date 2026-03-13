import React, { useState, useCallback } from 'react';
import TodoList from './TodoList';
import AddTodo from './AddTodo';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = useCallback((text) => {
    if (!text || text.trim() === '') {
      return false;
    }
    
    const newTodo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false
    };
    
    setTodos(prevTodos => [...prevTodos, newTodo]);
    return true;
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  );
};

export default TodoApp;