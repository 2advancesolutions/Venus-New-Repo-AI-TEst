import React from 'react';

function TodoItem({ todo, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label="Toggle todo completion"
        />
        <span className="todo-text" onClick={handleToggle}>
          {todo.text}
        </span>
      </div>
      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label="Delete todo"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  );
}

export default TodoItem;
