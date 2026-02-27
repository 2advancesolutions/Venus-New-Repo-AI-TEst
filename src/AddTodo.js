import React, { useState } from 'react';

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = onAdd(text);
    if (success) {
      setText('');
    } else {
      setError('Please enter a valid todo item');
    }
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (error && newText.trim()) {
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Add a new todo..."
        maxLength={200}
        aria-label="Add new todo"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'todo-error' : undefined}
      />
      <button type="submit" disabled={!text.trim()}>
        Add Todo
      </button>
      {error && (
        <span 
          id="todo-error" 
          style={{ color: 'red', marginLeft: '10px', display: 'block' }}
          role="alert"
        >
          {error}
        </span>
      )}
    </form>
  );
};

export default AddTodo;