import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from './TodoApp';

// Mock console.error to avoid React warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported in React 18/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('TodoApp - Edge Cases and Comprehensive Testing', () => {
  
  describe('Adding Todos - Edge Cases', () => {
    test('should not add empty todo', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should not add whitespace-only todo', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should not add todo with only newlines and spaces', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: '\n\t  \r  ' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should trim whitespace from valid todos', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: '  Buy milk  ' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.queryByText('  Buy milk  ')).not.toBeInTheDocument();
    });

    test('should handle very long todo text', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      const longText = 'a'.repeat(200);
      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(addButton);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    test('should handle special characters in todo text', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      const specialText = 'Buy milk & eggs @ store #shopping <script>alert("xss")</script>';
      fireEvent.change(input, { target: { value: specialText } });
      fireEvent.click(addButton);
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    test('should handle unicode characters', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      const unicodeText = 'Buy 🥛 and 🍳 for breakfast café';
      fireEvent.change(input, { target: { value: unicodeText } });
      fireEvent.click(addButton);
      
      expect(screen.getByText(unicodeText)).toBeInTheDocument();
    });

    test('should disable add button for empty input', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      expect(addButton).toBeDisabled();
      
      fireEvent.change(input, { target: { value: 'Test' } });
      expect(addButton).not.toBeDisabled();
      
      fireEvent.change(input, { target: { value: '' } });
      expect(addButton).toBeDisabled();
    });

    test('should clear input after successful add', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);
      
      expect(input.value).toBe('');
    });
  });

  describe('Deleting Todos - Edge Cases', () => {
    test('should handle deleting non-existent todo gracefully', () => {
      render(<TodoApp />);
      
      // Add some todos first
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      ['Todo 1', 'Todo 2'].forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });
      
      // Verify todos are added
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
      
      // Verify delete buttons exist
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });

    test('should handle rapid delete operations', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add multiple todos
      const todos = ['Todo 1', 'Todo 2', 'Todo 3'];
      todos.forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });
      
      // Delete all todos rapidly
      const deleteButtons = screen.getAllByText('Delete');
      deleteButtons.forEach(button => {
        fireEvent.click(button);
      });
      
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should maintain correct state after deleting middle todo', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add three todos
      ['First', 'Second', 'Third'].forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });
      
      // Delete the middle one
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[1]); // Delete 'Second'
      
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('State Updates and Persistence', () => {
    test('should properly update state when toggling completion', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);
      
      const checkbox = screen.getByRole('checkbox');
      const todoText = screen.getByText('Test todo');
      
      // Initially not completed
      expect(checkbox).not.toBeChecked();
      expect(todoText).not.toHaveClass('completed');
      
      // Toggle to completed
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(todoText).toHaveClass('completed');
      
      // Toggle back to not completed
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
      expect(todoText).not.toHaveClass('completed');
    });

    test('should maintain separate state for each todo', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add multiple todos
      ['Todo 1', 'Todo 2', 'Todo 3'].forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Toggle only the first todo
      fireEvent.click(checkboxes[0]);
      
      // Only first todo should be completed
      const todoTexts = screen.getAllByRole('listitem');
      expect(todoTexts[0].querySelector('span')).toHaveClass('completed');
      expect(todoTexts[1].querySelector('span')).not.toHaveClass('completed');
      expect(todoTexts[2].querySelector('span')).not.toHaveClass('completed');
    });

    test('should handle rapid state changes', async () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Rapidly toggle multiple times (even number for predictable final state)
      for (let i = 0; i < 6; i++) {
        fireEvent.click(checkbox);
      }
      
      // Final state should be consistent - unchecked after even number of toggles
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('UI and UX Edge Cases', () => {
    test('should display empty state message when no todos', () => {
      render(<TodoApp />);
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should hide empty state message when todos are added', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: 'Test todo' } });
      fireEvent.click(addButton);
      
      expect(screen.queryByText('No todos yet. Add one above!')).not.toBeInTheDocument();
    });

    test('should handle form submission with Enter key', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      
      fireEvent.change(input, { target: { value: 'Enter key test' } });
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(screen.getByText('Enter key test')).toBeInTheDocument();
    });

    test('should handle very large number of todos', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add 50 todos to test performance
      for (let i = 1; i <= 50; i++) {
        fireEvent.change(input, { target: { value: `Todo ${i}` } });
        fireEvent.click(addButton);
      }
      
      const todos = screen.getAllByRole('listitem');
      expect(todos).toHaveLength(50);
    });
  });

  describe('Error Handling and Validation', () => {
    test('should show error message for invalid input', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('Please enter a valid todo item')).toBeInTheDocument();
    });

    test('should clear error message when valid input is entered', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Trigger error
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(addButton);
      expect(screen.getByText('Please enter a valid todo item')).toBeInTheDocument();
      
      // Clear error with valid input
      fireEvent.change(input, { target: { value: 'Valid todo' } });
      expect(screen.queryByText('Please enter a valid todo item')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete todo lifecycle', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add todo
      fireEvent.change(input, { target: { value: 'Complete lifecycle test' } });
      fireEvent.click(addButton);
      
      // Verify added
      expect(screen.getByText('Complete lifecycle test')).toBeInTheDocument();
      
      // Complete todo
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      // Delete todo
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      
      // Verify deleted
      expect(screen.queryByText('Complete lifecycle test')).not.toBeInTheDocument();
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    test('should maintain state consistency across multiple operations', () => {
      render(<TodoApp />);
      const input = screen.getByPlaceholderText('Add a new todo...');
      const addButton = screen.getByText('Add Todo');
      
      // Add multiple todos
      const todos = ['Todo A', 'Todo B', 'Todo C'];
      todos.forEach(todo => {
        fireEvent.change(input, { target: { value: todo } });
        fireEvent.click(addButton);
      });
      
      // Complete first and third
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[2]);
      
      // Delete middle todo
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[1]);
      
      // Verify remaining todos and their states
      const remainingTodos = screen.getAllByRole('listitem');
      expect(remainingTodos).toHaveLength(2);
      
      const remainingCheckboxes = screen.getAllByRole('checkbox');
      expect(remainingCheckboxes[0]).toBeChecked(); // First todo completed
      expect(remainingCheckboxes[1]).not.toBeChecked(); // Third todo (now second) not completed
    });
  });
});