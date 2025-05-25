// Priority order for sorting tasks (High comes first, then Medium, then Low)
const PRIORITY_ORDER = { High: 1, Medium: 2, Low: 3 };

// Get the list of tasks from the browser (or return an empty list if none)
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save the list of tasks to the browser
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to format time (e.g., 13:00 -> 1:00 PM)
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
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

// Export functions for use in other files
export {
    PRIORITY_ORDER,
    getTasks,
    saveTasks,
    formatTime,
    formatDuration,
    populateDurationOptions
}; 