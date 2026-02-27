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

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        maxLength={200}
      />
      <button type="submit" disabled={!text.trim()}>
        Add Todo
      </button>
      {error && <span style={{ color: 'red', marginLeft: '10px' }}>{error}</span>}
    </form>
  );
};

export default AddTodo;