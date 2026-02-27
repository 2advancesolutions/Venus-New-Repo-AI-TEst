import React, { useState } from 'react';

function AddTodo({ onAdd }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (trimmedInput) {
      onAdd(trimmedInput);
      setInput('');
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={input}
        onChange={handleChange}
        aria-label="New todo"
      />
      <button
        type="submit"
        className="add-btn"
        disabled={!input.trim()}
      >
        Add
      </button>
    </form>
  );
}

export default AddTodo;
