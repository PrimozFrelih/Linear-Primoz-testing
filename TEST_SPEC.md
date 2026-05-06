# Test Spec

## Functional test cases

### Initial load
- When no tasks exist in `localStorage`, show the empty-state message.
- When tasks exist in `localStorage`, render them on load.
- When tasks exist, hide the empty-state message.

### Task creation
- Creating a task with valid text adds a new item to the list.
- Pressing `Enter` with valid text adds a new item.
- Creating a task clears the input afterward.
- Creating a task stores it in `localStorage`.
- Empty input does not create a task.
- Whitespace-only input does not create a task.

### Task completion
- Toggling a task marks it complete.
- Completed tasks show completed styling.
- Toggling again marks the task incomplete.
- Toggle changes persist after refresh.

### Task editing
- Editing a task with valid text updates the task.
- Canceling edit leaves the task unchanged.
- Editing to empty text is rejected.
- Editing changes persist after refresh.

### Task deletion
- Deleting a task removes it from the list.
- Deleting a task updates `localStorage`.
- Deleting the last task shows the empty-state message.

## Data expectations

Each task should contain:
- `id`
- `text`
- `completed`

## Edge cases

- Multiple tasks can be added in sequence.
- Duplicate visible text is allowed unless product rules change.
- Refreshing the page preserves the latest saved state.
- Invalid or empty user input does not corrupt saved data.
