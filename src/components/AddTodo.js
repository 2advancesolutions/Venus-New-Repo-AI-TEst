import React, { useState } from 'react';
import './AddTodo.css';

const AddTodo = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
          maxLength={100}
        />
        <button type="submit" className="add-button" disabled={!inputValue.trim()}>
          Add
        </button>
      </div>
    </form>
  );
};

export default AddTodo;