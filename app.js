// =====================
// To-Do List App JavaScript
// This file controls how the to-do list works: adding, editing, deleting, and showing tasks.
// =====================

// Priority order for sorting tasks (High comes first, then Medium, then Low)
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

// =====================
// Functions to get and save tasks in the browser's local storage
// =====================

// Get the list of tasks from the browser (or return an empty list if none)
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save the list of tasks to the browser
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// =====================
// Function to show all tasks on the page, sorted by priority
// =====================
function renderTasks() {
    const tasks = getTasks(); // Get all tasks
    const taskList = document.getElementById('taskList'); // Where tasks will be shown
    taskList.innerHTML = '';

    // Sort tasks by priority
    const sortedTasks = [...tasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    // Emojis for each priority
    const priorityEmoji = {
        High: '🔥',
        Medium: '🙂',
        Low: '😴'
    };

    // Filter tasks by priority in order
    let tasksToShow = [];
    const highPriorityTasks = sortedTasks.filter(task => task.priority === 'High');
    const mediumPriorityTasks = sortedTasks.filter(task => task.priority === 'Medium');
    const lowPriorityTasks = sortedTasks.filter(task => task.priority === 'Low');

    // Show tasks based on priority availability
    if (highPriorityTasks.length > 0) {
        tasksToShow = highPriorityTasks;
    } else if (mediumPriorityTasks.length > 0) {
        tasksToShow = mediumPriorityTasks;
    } else if (lowPriorityTasks.length > 0) {
        tasksToShow = lowPriorityTasks;
    }

    // Show each task in the list
    tasksToShow.forEach((task) => {
        // Find the original index in the unsorted array
        const originalIndex = tasks.findIndex(
            t => t.text === task.text &&
                 t.priority === task.priority &&
                 t.date === task.date &&
                 t.duration === task.duration
        );
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="event-name">${task.text}</span>
            <span class="event-time">
                ${task.date ? task.date : ''}
                ${task.duration ? `<span style="margin-left: 10px;">${formatDuration(task.duration)}</span>` : ''}
                <span style="color:#ffb32c; font-weight:bold; margin-left:10px;">${priorityEmoji[task.priority]} ${task.priority}</span>
            </span>
        `;

        // Create the Edit button for this task
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editTask(originalIndex);

        // Create the Delete button for this task
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteTask(originalIndex);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });

    // Show message if no tasks
    if (tasksToShow.length === 0) {
        const li = document.createElement('li');
        li.innerHTML = '<span class="event-name">No tasks available</span>';
        taskList.appendChild(li);
    }
}

// =====================
// Helper function to format time (e.g., 13:00 -> 1:00 PM)
// =====================
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
}

// =====================
// Add/Edit Task Logic
// =====================
let editingIndex = null; // Keeps track of which task is being edited (if any)

// Show/hide the Add button and Confirm/Cancel buttons depending on edit mode
function updateAddEditButtons() {
    const addBtn = document.getElementById('addTaskButton');
    let confirmRow = document.getElementById('confirmEditRow');
    if (editingIndex !== null) {
        addBtn.style.display = 'none'; // Hide Add button when editing
        if (!confirmRow) {
            // Create Confirm and Cancel buttons if they don't exist
            confirmRow = document.createElement('div');
            confirmRow.className = 'add-btn-row';
            confirmRow.id = 'confirmEditRow';
            confirmRow.innerHTML = `
                <button id="confirmEditBtn" class="login-btn">Confirm</button>
                <button id="cancelEditBtn" class="delete-btn">Cancel</button>
            `;
            addBtn.parentNode.parentNode.appendChild(confirmRow);
            document.getElementById('confirmEditBtn').onclick = confirmEdit;
            document.getElementById('cancelEditBtn').onclick = cancelEdit;
        } else {
            confirmRow.style.display = 'flex';
        }
    } else {
        addBtn.style.display = '';
        if (confirmRow) confirmRow.style.display = 'none';
    }
}

// =====================
// Function to add a new task (when not editing)
// =====================
function addTask() {
    if (editingIndex !== null) return; // Don't add if editing
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    const text = taskInput.value.trim(); // The task name
    const priority = priorityInput.value; // Priority (Low/Medium/High)
    const date = dateInput.value; // Date for the task
    const duration = timeInput.value; // Duration in minutes

    if (text) { // Only add if there's a task name
        const tasks = getTasks();
        const newTask = { 
            id: Date.now(), // Add unique ID
            text, 
            priority, 
            date,
            duration // Store the duration
        };
        tasks.push(newTask); // Add the new task to the list
        saveTasks(tasks); // Save the updated list
        // Clear the input fields
        taskInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
        priorityInput.value = 'Low';
        renderTasks(); // Show the updated list
    }
}

// =====================
// Function to start editing a task
// =====================
function editTask(index) {
    const tasks = getTasks();
    const task = tasks[index];
    
    // Fill the input fields with the task's current values
    document.getElementById('taskInput').value = task.text;
    document.getElementById('priorityInput').value = task.priority;
    document.getElementById('dateInput').value = task.date || '';
    
    // Handle time inputs
    const timeInput = document.getElementById('timeInput');
    if (task.duration) {
        timeInput.value = task.duration;
    } else {
        timeInput.value = '';
    }
    
    // Store the index of the task being edited
    editingIndex = index;
    
    // Update the UI to show we're in edit mode
    updateAddEditButtons();
    
    // Scroll to the add task form
    document.querySelector('.add-task-card').scrollIntoView({ behavior: 'smooth' });
}

// =====================
// Function to confirm editing a task
// =====================
function confirmEdit() {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    
    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const date = dateInput.value;
    
    // Parse time range
    let duration = '';
    if (timeInput.value) {
        duration = timeInput.value;
    }
    
    if (text && editingIndex !== null) {
        const tasks = getTasks();
        // Update the task with new values
        tasks[editingIndex] = {
            ...tasks[editingIndex], // Keep existing properties
            text,
            priority,
            date,
            duration
        };
        
        saveTasks(tasks);
        editingIndex = null;
        
        // Clear the input fields
        taskInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
        priorityInput.value = 'Low';
        
        renderTasks();
        updateAddEditButtons();
    }
}

// =====================
// Function to cancel editing
// =====================
function cancelEdit() {
    editingIndex = null;
    
    // Clear the input fields
    document.getElementById('taskInput').value = '';
    document.getElementById('priorityInput').value = 'Low';
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';
    
    updateAddEditButtons();
}

// =====================
// Function to delete a task
// =====================
function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1); // Remove the task from the list
    saveTasks(tasks); // Save the updated list
    renderTasks(); // Show the updated list
}

// =====================
// Event listeners for adding/updating a task
// =====================
// When the Add button is clicked, add a new task
const addTaskButton = document.getElementById('addTaskButton');
addTaskButton.addEventListener('click', addTask);
// When Enter is pressed in the input box, add a new task (if not editing)
document.getElementById('taskInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && editingIndex === null) addTask();
});

// =====================
// Week Navigation: Month/Year Display
// =====================
let currentWeekStart = null; // Keeps track of which week is being shown

// Get the dates for the current week (Sunday to Saturday)
function getWeekDates() {
    const today = new Date();
    let start;
    if (currentWeekStart) {
        start = new Date(currentWeekStart);
    } else {
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Go to Sunday
    }
    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        week.push(d);
    }
    return week;
}

// Show the week navigation (days, month, year)
function renderWeek() {
    const weekDays = document.querySelector('.week-days');
    weekDays.innerHTML = '';
    const week = getWeekDates();
    const today = new Date();
    week.forEach(date => {
        const dayPill = document.createElement('span');
        // Highlight today with the 'active' class
        dayPill.className = 'day-pill' + (date.toDateString() === today.toDateString() && (!currentWeekStart || (new Date(currentWeekStart)).toDateString() === (new Date(today.setDate(today.getDate() - today.getDay()))).toDateString()) ? ' active' : '');
        dayPill.textContent = date.getDate(); // Show the day number
        weekDays.appendChild(dayPill);
    });
    // Set month and year (show month/year of first day in week)
    const firstDay = week[0];
    const options = { month: 'long', year: 'numeric' };
    const monthYearStr = firstDay.toLocaleDateString(undefined, options);
    document.getElementById('monthYear').textContent = monthYearStr;
}

// Initial render of week navigation
renderWeek();

// When the Previous Week button is clicked, show the previous week
document.getElementById('prevWeekBtn').addEventListener('click', () => {
    const week = getWeekDates();
    const prev = new Date(week[0]);
    prev.setDate(prev.getDate() - 7);
    currentWeekStart = prev;
    renderWeek();
});

// When the Next Week button is clicked, show the next week
document.getElementById('nextWeekBtn').addEventListener('click', () => {
    const week = getWeekDates();
    const next = new Date(week[0]);
    next.setDate(next.getDate() + 7);
    currentWeekStart = next;
    renderWeek();
});

// When the Current Week button is clicked, go back to this week
document.getElementById('currentWeekBtn').addEventListener('click', () => {
    currentWeekStart = null;
    renderWeek();
});

// =====================
// Initial render of tasks and button states
// =====================
renderTasks(); // Show all tasks when the page loads
updateAddEditButtons(); // Set up the Add/Confirm/Cancel buttons

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate duration options
    populateDurationOptions();

    // Check if we're coming from task list page with an edit request
    const editingTaskIndex = localStorage.getItem('editingTaskIndex');
    if (editingTaskIndex !== null) {
        editTask(parseInt(editingTaskIndex));
        localStorage.removeItem('editingTaskIndex');
    }

    // Set up event listeners
    const addTaskButton = document.getElementById('addTaskButton');
    addTaskButton.addEventListener('click', addTask);
    
    document.getElementById('taskInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && editingIndex === null) addTask();
    });

    // Week navigation event listeners
    document.getElementById('prevWeekBtn').addEventListener('click', () => {
        const week = getWeekDates();
        const prev = new Date(week[0]);
        prev.setDate(prev.getDate() - 7);
        currentWeekStart = prev;
        renderWeek();
    });

    document.getElementById('nextWeekBtn').addEventListener('click', () => {
        const week = getWeekDates();
        const next = new Date(week[0]);
        next.setDate(next.getDate() + 7);
        currentWeekStart = next;
        renderWeek();
    });

    document.getElementById('currentWeekBtn').addEventListener('click', () => {
        currentWeekStart = null;
        renderWeek();
    });

    // Initial render
    renderTasks();
    renderWeek();
    updateAddEditButtons();
});

// Function to populate duration options
function populateDurationOptions() {
    const timeSelect = document.getElementById('timeInput');
    const durations = [
        { label: '15 minutes', value: '15' },
        { label: '30 minutes', value: '30' },
        { label: '45 minutes', value: '45' },
        { label: '1 hour', value: '60' },
        { label: '1.5 hours', value: '90' },
        { label: '2 hours', value: '120' },
        { label: '2.5 hours', value: '150' },
        { label: '3 hours', value: '180' }
    ];

    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select Duration</option>';

    // Add duration options
    durations.forEach(duration => {
        const option = document.createElement('option');
        option.value = duration.value;
        option.textContent = duration.label;
        timeSelect.appendChild(option);
    });
}

// Function to format duration
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
        return `${mins} minutes`;
    } else if (mins === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
    }
}