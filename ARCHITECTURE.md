# React Todo Application Architecture

## Component Structure

### Component Hierarchy
```
TodoApp (Root)
├── TodoInput
├── TodoFilter
└── TodoList
    └── TodoItem (multiple)
```

### Component Responsibilities

**TodoApp.jsx**
- Root component managing global state
- Handles add, delete, toggle, and filter logic
- Passes data and handlers down via props

**TodoInput.jsx**
- Controlled input field for new todos
- Submit handler (Enter key or button)
- Clears input after submission

**TodoList.jsx**
- Receives filtered todos array
- Maps over items and renders TodoItem components
- Displays empty state message when no todos

**TodoItem.jsx**
- Individual todo display (text + checkbox + delete button)
- Receives toggle and delete handlers as props
- Visual distinction for completed items (strikethrough/opacity)

**TodoFilter.jsx**
- Three filter buttons: All, Active, Completed
- Highlights current active filter
- Displays remaining todo count

## State Management Approach

### useState (Recommended for Simplicity)
```javascript
const [todos, setTodos] = useState([])
const [filter, setFilter] = useState('all')
```

### Todo Data Structure
```javascript
{
  id: string,           // unique identifier (crypto.randomUUID() or Date.now())
  text: string,         // todo description
  completed: boolean,   // completion status
  createdAt: number     // timestamp
}
```

### State Operations
- **Add**: Append new todo object to array
- **Toggle**: Update completed status by id
- **Delete**: Filter out todo by id
- **Filter**: Compute derived state (all/active/completed)

### Alternative: useReducer (For Scalability)
If complexity grows, refactor to useReducer with action types:
- `ADD_TODO`, `TOGGLE_TODO`, `DELETE_TODO`, `SET_FILTER`

## File Organization

```
Venus-New-Repo-AI-TEst/
├── README.md
├── ARCHITECTURE.md
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.js (alias for TodoApp)
│   ├── styles/
│   │   ├── App.css
│   │   └── components/
│   │       ├── TodoInput.css
│   │       ├── TodoList.css
│   │       ├── TodoItem.css
│   │       └── TodoFilter.css
│   ├── components/
│   │   ├── TodoApp.jsx
│   │   ├── TodoInput.jsx
│   │   ├── TodoList.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoFilter.jsx
│   └── utils/
│       └── todoHelpers.js (filterTodos, getActiveCount)
├── package.json
└── .gitignore
```

## Key Features

1. **Add Todos**: Text input with submit
2. **Toggle Complete**: Checkbox interaction
3. **Delete Todos**: Remove button per item
4. **Filter View**: All/Active/Completed tabs
5. **Persistence** (Optional): localStorage sync via useEffect

## Implementation Notes

### Props Flow Pattern
```javascript
// TodoApp manages state and creates handlers
const addTodo = (text) => { /* ... */ }
const toggleTodo = (id) => { /* ... */ }
const deleteTodo = (id) => { /* ... */ }

// Pass to children
<TodoInput onAdd={addTodo} />
<TodoList 
  todos={filteredTodos} 
  onToggle={toggleTodo} 
  onDelete={deleteTodo} 
/>
```

### Filtering Logic
```javascript
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed
  if (filter === 'completed') return todo.completed
  return true // 'all'
})
```

### Local Storage Sync (Optional Enhancement)
```javascript
useEffect(() => {
  const saved = localStorage.getItem('todos')
  if (saved) setTodos(JSON.parse(saved))
}, [])

useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos])
```

## Styling Approach

**Option 1**: CSS Modules (scoped styles per component)
**Option 2**: Styled Components (CSS-in-JS)
**Option 3**: Plain CSS with BEM naming convention

Recommendation: Start with plain CSS, refactor if needed.

## Testing Strategy

- **Unit Tests**: Individual component rendering
- **Integration Tests**: User interactions (add, toggle, delete)
- **E2E Tests** (Optional): Full workflow with Cypress/Playwright

## Future Enhancements

- Edit todo text inline
- Due dates and priority levels
- Drag-and-drop reordering
- Categories/tags
- Backend API integration
- User authentication

---

**Architecture Status**: Ready for implementation
**Estimated Complexity**: Low (beginner-friendly)
**Tech Stack**: React 18+, modern hooks, no external state libraries required

— Venus 🌟
