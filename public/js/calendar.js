// Check authentication
checkAuth();

let calendar;
let allTasks = [];

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', initCalendar);

async function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    // Load tasks first
    await loadAllTasks();
    
    // Initialize FullCalendar
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pl',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        },
        events: convertTasksToEvents(allTasks),
        eventClick: handleEventClick,
        dateClick: handleDateClick,
        editable: false,
    });
    
    calendar.render();
}

async function loadAllTasks() {
    try {
        const response = await fetchAPI('/tasks?limit=1000');
        const data = await response.json();

        if (response.ok) {
            allTasks = data.data || [];
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

function convertTasksToEvents(tasks) {
    return tasks
        .filter(task => task.due_date)
        .map(task => {
            const priorityColors = {
                low: '#6c757d',
                medium: '#17a2b8',
                high: '#ffc107',
                urgent: '#dc3545',
            };

            return {
                id: task.id,
                title: task.title,
                start: task.due_date,
                backgroundColor: priorityColors[task.priority] || '#007bff',
                borderColor: priorityColors[task.priority] || '#007bff',
                extendedProps: {
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    clientId: task.client_id,
                },
            };
        });
}

function handleEventClick(info) {
    const event = info.event;
    const task = allTasks.find(t => t.id === parseInt(event.id));

    if (task) {
        displayTaskDetails(task);
    }
}

function handleDateClick(info) {
    const dateStr = info.dateStr;
    const tasksOnDate = allTasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date).toISOString().split('T')[0];
        return taskDate === dateStr;
    });

    if (tasksOnDate.length > 0) {
        displayTaskDetails(tasksOnDate[0]);
    }
}

function displayTaskDetails(task) {
    const detailsDiv = document.getElementById('taskDetails');
    
    const statusColor = {
        pending: 'primary',
        in_progress: 'info',
        completed: 'success',
        cancelled: 'secondary',
    };

    const priorityColor = {
        low: 'secondary',
        medium: 'info',
        high: 'warning',
        urgent: 'danger',
    };

    const statusLabels = {
        pending: 'Nowe',
        in_progress: 'W trakcie',
        completed: 'Ukończone',
        cancelled: 'Anulowane',
    };

    const priorityLabels = {
        low: 'Niski',
        medium: 'Średni',
        high: 'Wysoki',
        urgent: 'Nadzwyczajny',
    };

    const daysLeft = task.due_date ? Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    detailsDiv.innerHTML = `
        <div class="task-details fade-in">
            <h6 class="mb-3">${task.title}</h6>
            
            <div class="mb-2">
                <small class="text-muted">Status:</small><br>
                <span class="badge bg-${statusColor[task.status]}">${statusLabels[task.status]}</span>
            </div>
            
            <div class="mb-2">
                <small class="text-muted">Priorytet:</small><br>
                <span class="badge bg-${priorityColor[task.priority]}">${priorityLabels[task.priority]}</span>
            </div>
            
            ${task.description ? `
                <div class="mb-2">
                    <small class="text-muted">Opis:</small><br>
                    <small>${task.description}</small>
                </div>
            ` : ''}
            
            ${task.due_date ? `
                <div class="mb-2">
                    <small class="text-muted">Termin:</small><br>
                    <small>${formatDate(task.due_date)}</small>
                    ${daysLeft !== null ? `
                        <br>
                        <small class="text-${daysLeft < 0 ? 'danger' : daysLeft < 3 ? 'warning' : 'muted'}">
                            ${daysLeft < 0 ? '⚠️ Zaległy' : daysLeft === 0 ? '📌 Dzisiaj' : `${daysLeft} dni pozostało`}
                        </small>
                    ` : ''}
                </div>
            ` : ''}
            
            <div class="mt-3">
                <button class="btn btn-sm btn-primary" onclick="goToTaskEdit(${task.id})">
                    Edytuj
                </button>
            </div>
        </div>
    `;
}

function goToTaskEdit(taskId) {
    window.location.href = `/tasks?task=${taskId}`;
}

// Refresh calendar when tasks change
function refreshCalendar() {
    loadAllTasks().then(() => {
        if (calendar) {
            calendar.refetchEvents();
            calendar.getEvents().forEach(event => event.remove());
            convertTasksToEvents(allTasks).forEach(event => {
                calendar.addEvent(event);
            });
        }
    });
}
