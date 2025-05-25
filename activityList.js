import { PRIORITY_ORDER, getTasks, saveTasks, formatDuration } from './activityService.js';

let editingIndex = null; // Keeps track of which task is being edited (if any)

// Function to show all tasks on the page, sorted by priority
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

// Function to add a new task (when not editing)
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

// Function to start editing a task
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

// Function to confirm editing a task
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

// Function to cancel editing
function cancelEdit() {
    editingIndex = null;
    
    // Clear the input fields
    document.getElementById('taskInput').value = '';
    document.getElementById('priorityInput').value = 'Low';
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';
    
    updateAddEditButtons();
}

// Function to delete a task
function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1); // Remove the task from the list
    saveTasks(tasks); // Save the updated list
    renderTasks(); // Show the updated list
}

// Export functions for use in other files
export {
    renderTasks,
    updateAddEditButtons,
    addTask,
    editTask,
    confirmEdit,
    cancelEdit,
    deleteTask
}; 