// Constants for task priorities and their order
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };
const PRIORITY_EMOJI = { High: '🔥', Medium: '🙂', Low: '😴' };

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for filters
    document.getElementById('priorityFilter').addEventListener('change', renderTasks);
    document.getElementById('statusFilter').addEventListener('change', renderTasks);
    
    // Set up search input event listener
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(renderTasks, 300));
    
    // Initial render of tasks
    renderTasks();
});

// Debounce function to limit how often the search function is called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle task completion status
function toggleTaskStatus(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
}

// Edit task function
function editTask(index) {
    // Store the task index in localStorage
    localStorage.setItem('editingTaskIndex', index);
    // Redirect to main page for editing
    window.location.href = 'index.html';
}

// Delete task function
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }
}

// Render tasks based on filters and search
function renderTasks() {
    const tasks = getTasks();
    const taskList = document.getElementById('taskList');
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    // Clear the task list
    taskList.innerHTML = '';
    
    // Filter and sort tasks
    let filteredTasks = tasks.filter(task => {
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'completed' && task.completed) ||
            (statusFilter === 'pending' && !task.completed);
        const matchesSearch = searchQuery === '' || 
            task.text.toLowerCase().includes(searchQuery) ||
            task.priority.toLowerCase().includes(searchQuery) ||
            (task.date && task.date.toLowerCase().includes(searchQuery));
        
        return matchesPriority && matchesStatus && matchesSearch;
    });
    
    // Sort by priority and then by date
    filteredTasks.sort((a, b) => {
        if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        }
        return new Date(a.date) - new Date(b.date);
    });
    
    // Render each task
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        const originalIndex = tasks.findIndex(t => t === task);
        
        // Create task content with completion status
        li.innerHTML = `
            <div class="task-content ${task.completed ? 'completed' : ''}">
                <span class="event-name">${task.text}</span>
                <span class="event-time">
                    ${task.date ? task.date : ''}
                    ${task.startTime || task.endTime ? 
                        `<span>${task.startTime ? formatTime(task.startTime) : ''}${task.endTime ? ' - ' + formatTime(task.endTime) : ''}</span>` 
                        : ''}
                    <span style="color:#ffb32c; font-weight:bold; margin-left:10px;">
                        ${PRIORITY_EMOJI[task.priority]} ${task.priority}
                    </span>
                </span>
            </div>
        `;
        
        // Create action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'task-actions';
        
        // Toggle completion button
        const toggleButton = document.createElement('button');
        toggleButton.className = `toggle-btn ${task.completed ? 'completed' : 'pending'}`;
        toggleButton.textContent = task.completed ? 'Mark Pending' : 'Mark Complete';
        toggleButton.onclick = () => toggleTaskStatus(originalIndex);
        buttonContainer.appendChild(toggleButton);
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editTask(originalIndex);
        buttonContainer.appendChild(editButton);
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteTask(originalIndex);
        buttonContainer.appendChild(deleteButton);
        
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
    
    // Show message if no tasks
    if (filteredTasks.length === 0) {
        const li = document.createElement('li');
        li.innerHTML = '<span class="event-name">No tasks found</span>';
        taskList.appendChild(li);
    }
}

// Helper function to format time
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
} 